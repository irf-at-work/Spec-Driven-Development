using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using SDD.API.Contracts;
using SDD.API.DTOs;

namespace SDD.API.Tests.VehicleMakes;

/// <summary>
/// Starts the real API against a real Oracle test schema (constitution Article 4: tests prove the acceptance criteria).
/// Every make a test creates uses a code starting "ZT" and is removed again when the tests finish.
/// </summary>
public sealed class OracleApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string ConnectionVariable = "SDD_TEST_ORACLE_CONNECTION";

    private readonly ConcurrentBag<string> createdCodes = [];

    public OracleApiFactory()
    {
        var connectionString = Environment.GetEnvironmentVariable(ConnectionVariable);
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"Set the environment variable {ConnectionVariable} to the connection string of an approved Oracle TEST schema "
                + "before running these tests. They create and delete rows whose codes start with ZT.");
        }

        Environment.SetEnvironmentVariable("ConnectionStrings__SddOracle", connectionString);
    }

    public string Track(string makeCode)
    {
        createdCodes.Add(makeCode);
        return makeCode;
    }

    public ValueTask InitializeAsync() => ValueTask.CompletedTask;

    public override async ValueTask DisposeAsync()
    {
        using var client = CreateClient();
        foreach (var makeCode in createdCodes)
        {
            // A make that still has models cannot be deleted, so its models are removed first.
            while (true)
            {
                var modelsResponse = await client.GetAsync($"/api/vehicle-makes/{makeCode}/models?page=1");
                if (!modelsResponse.IsSuccessStatusCode)
                {
                    break;
                }

                var models = await modelsResponse.Content.ReadFromJsonAsync<PaginatedResult<VehicleModelDto>>();
                if (models is null || models.Items.Count == 0)
                {
                    break;
                }

                foreach (var model in models.Items)
                {
                    await client.DeleteAsync($"/api/vehicle-makes/{makeCode}/models/{model.ModelCode}");
                }
            }

            // Some tests delete their own make already, so a "not found" here is expected and ignored.
            await client.DeleteAsync($"/api/vehicle-makes/{makeCode}");
        }

        await base.DisposeAsync();
        GC.SuppressFinalize(this);
    }
}

[CollectionDefinition("Oracle API")]
public sealed class OracleApiCollection : ICollectionFixture<OracleApiFactory>
{
}

[Collection("Oracle API")]
public class VehicleMakeApiTests(OracleApiFactory factory)
{
    private const string Url = "/api/vehicle-makes";

    private readonly HttpClient client = factory.CreateClient();

    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    // "ZT" plus ten hex digits: exactly the 12 characters a make code may have.
    private string NewCode() =>
        factory.Track(("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant());

    private Task<HttpResponseMessage> Create(
        string makeCode,
        string makeName = "Test Make",
        string shortName = "Test",
        string? remarks = null,
        string? arabicMakeName = null,
        bool? active = null) =>
        client.PostAsJsonAsync(
            Url,
            new { makeCode, makeName, shortName, remarks, arabicMakeName, active },
            Cancellation);

    private static async Task<T> Read<T>(HttpResponseMessage response)
    {
        var body = await response.Content.ReadFromJsonAsync<T>(Cancellation);
        return Assert.IsType<T>(body);
    }

    private static async Task<string> FirstErrorFor(HttpResponseMessage response, string field)
    {
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        return document.RootElement.GetProperty("errors").GetProperty(field)[0].GetString()!;
    }

    [Fact]
    public async Task Creating_a_make_saves_it_in_capitals_with_tidy_names_and_the_admin_stamp()
    {
        var code = NewCode();

        var response = await Create(code.ToLowerInvariant(), "toyota   motor", "BMW");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var make = await Read<VehicleMakeDto>(response);
        Assert.Equal(code, make.MakeCode);
        Assert.Equal("Toyota Motor", make.MakeName);
        Assert.Equal("BMW", make.ShortName);
        Assert.Equal("admin", make.CreatedBy);
        Assert.Equal("admin", make.LastChangedBy);
    }

    [Fact]
    public async Task A_make_can_be_read_back_by_its_code_in_any_case()
    {
        var code = NewCode();
        await Create(code);

        var response = await client.GetAsync($"{Url}/{code.ToLowerInvariant()}", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(code, (await Read<VehicleMakeDto>(response)).MakeCode);
    }

    [Fact]
    public async Task Arabic_text_is_saved_and_returned_exactly_as_typed()
    {
        var code = NewCode();
        const string arabic = "  تويوتا   موتور ";

        await Create(code, arabicMakeName: arabic);
        var make = await Read<VehicleMakeDto>(await client.GetAsync($"{Url}/{code}", Cancellation));

        Assert.Equal(arabic, make.ArabicMakeName);
    }

    [Fact]
    public async Task Creating_a_make_whose_code_already_exists_is_refused_and_nothing_changes()
    {
        var code = NewCode();
        await Create(code, "First Name", "First");

        var second = await Create(code, "Second Name", "Second");

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal("This make code already exists.", await FirstErrorFor(second, "makeCode"));
        var stored = await Read<VehicleMakeDto>(await client.GetAsync($"{Url}/{code}", Cancellation));
        Assert.Equal("First Name", stored.MakeName);
    }

    [Fact]
    public async Task Creating_a_make_with_invalid_values_is_refused_and_nothing_is_saved()
    {
        var code = NewCode();

        var response = await Create(code, makeName: "   ");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Make name is required.", await FirstErrorFor(response, "makeName"));
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"{Url}/{code}", Cancellation)).StatusCode);
    }

    [Fact]
    public async Task Updating_changes_the_details_but_never_the_code_or_the_created_by_stamp()
    {
        var code = NewCode();
        await Create(code, "Old Name", "Old");

        var response = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeName = "new name", shortName = "New", remarks = "Some remarks" },
            Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await Read<VehicleMakeDto>(response);
        Assert.Equal(code, updated.MakeCode);
        Assert.Equal("New Name", updated.MakeName);
        Assert.Equal("Some remarks", updated.Remarks);
        Assert.Equal("admin", updated.CreatedBy);
        Assert.Equal("admin", updated.LastChangedBy);
    }

    [Fact]
    public async Task Updating_with_invalid_values_is_refused_and_the_make_is_unchanged()
    {
        var code = NewCode();
        await Create(code, "Keep Me", "Keep");

        var response = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeName = "", shortName = "Keep" },
            Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var stored = await Read<VehicleMakeDto>(await client.GetAsync($"{Url}/{code}", Cancellation));
        Assert.Equal("Keep Me", stored.MakeName);
    }

    [Fact]
    public async Task Updating_a_make_that_does_not_exist_reports_not_found()
    {
        var response = await client.PutAsJsonAsync(
            $"{Url}/{NewCode()}",
            new { makeName = "Name", shortName = "Short" },
            Cancellation);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Deleting_removes_the_make_for_good_and_a_second_delete_reports_not_found()
    {
        var code = NewCode();
        await Create(code);

        var deleted = await client.DeleteAsync($"{Url}/{code}", Cancellation);
        var readAgain = await client.GetAsync($"{Url}/{code}", Cancellation);
        var deletedAgain = await client.DeleteAsync($"{Url}/{code}", Cancellation);

        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, readAgain.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, deletedAgain.StatusCode);
    }

    [Fact]
    public async Task Filtering_and_paging_find_every_make_across_pages_in_code_order()
    {
        // Twelve makes sharing one run id, so a filter on that id finds exactly them, split over two pages.
        var runId = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
        for (var number = 1; number <= 12; number++)
        {
            factory.Track($"ZT{runId}{number:00}");
            await Create($"ZT{runId}{number:00}", $"Make {number:00}", $"M{number:00}");
        }

        var first = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?page=1&makeCode={runId.ToLowerInvariant()}", Cancellation));
        var second = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?page=2&makeCode={runId}", Cancellation));
        var beyond = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?page=3&makeCode={runId}", Cancellation));

        Assert.Equal(12, first.TotalCount);
        Assert.Equal(10, first.PageSize);
        Assert.Equal(10, first.Items.Count);
        Assert.Equal(2, second.Items.Count);
        Assert.Empty(beyond.Items);
        Assert.Equal($"ZT{runId}01", first.Items[0].MakeCode);
        Assert.Equal($"ZT{runId}12", second.Items[^1].MakeCode);
    }

    [Fact]
    public async Task Sorting_by_name_descending_orders_the_whole_result_set()
    {
        var runId = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
        for (var number = 1; number <= 3; number++)
        {
            factory.Track($"ZT{runId}{number:00}");
            await Create($"ZT{runId}{number:00}", $"Make {number:00}", $"M{number:00}");
        }

        var result = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?makeCode={runId}&sortBy=makeName&sortDirection=desc", Cancellation));

        Assert.Equal(new[] { "Make 03", "Make 02", "Make 01" }, result.Items.Select(item => item.MakeName));
    }

    [Fact]
    public async Task An_unknown_sort_column_is_refused_with_a_problem_response()
    {
        var response = await client.GetAsync($"{Url}?sortBy=remarks", Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task A_make_code_sent_in_an_update_body_is_ignored_because_the_code_never_changes()
    {
        var code = NewCode();
        var otherCode = NewCode();
        await Create(code, "Original", "Orig");

        var response = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeCode = otherCode, makeName = "Changed", shortName = "Chg" },
            Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(code, (await Read<VehicleMakeDto>(response)).MakeCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"{Url}/{otherCode}", Cancellation)).StatusCode);
    }

    [Fact]
    public async Task Updating_keeps_Arabic_text_exactly_and_clears_values_that_are_sent_empty()
    {
        var code = NewCode();
        const string arabic = "  تويوتا   موتور ";
        await Create(code, remarks: "Old remarks", arabicMakeName: "قديم");

        var response = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeName = "Test Make", shortName = "Test", remarks = "", arabicMakeName = arabic },
            Cancellation);

        var updated = await Read<VehicleMakeDto>(response);
        Assert.Equal(arabic, updated.ArabicMakeName);
        Assert.Null(updated.Remarks);
    }

    [Fact]
    public async Task A_name_over_its_limit_is_refused_with_the_maximum_message_and_nothing_is_saved()
    {
        var code = NewCode();

        var response = await Create(code, makeName: new string('a', 101));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Maximum 100 characters.", await FirstErrorFor(response, "makeName"));
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"{Url}/{code}", Cancellation)).StatusCode);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task A_blank_make_code_is_refused_as_required(string makeCode)
    {
        var response = await Create(makeCode);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Make code is required.", await FirstErrorFor(response, "makeCode"));
    }

    [Fact]
    public async Task A_make_code_with_characters_other_than_letters_digits_and_hyphens_is_refused()
    {
        var response = await Create("ZT_bad code");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(
            "Make code can contain only letters, digits and hyphens.",
            await FirstErrorFor(response, "makeCode"));
    }

    [Fact]
    public async Task A_make_code_longer_than_twelve_characters_is_refused()
    {
        var response = await Create(new string('A', 13));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Maximum 12 characters.", await FirstErrorFor(response, "makeCode"));
    }

    [Fact]
    public async Task Not_found_answers_are_problem_responses_without_a_stack_trace()
    {
        var response = await client.GetAsync($"{Url}/{NewCode()}", Cancellation);
        var body = await response.Content.ReadAsStringAsync(Cancellation);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        Assert.DoesNotContain(" at SDD.API", body);
    }

    [Fact]
    public async Task A_new_make_is_active_unless_it_is_created_switched_off()
    {
        var defaultCode = NewCode();
        var offCode = NewCode();

        var byDefault = await Read<VehicleMakeDto>(await Create(defaultCode));
        var switchedOff = await Read<VehicleMakeDto>(await Create(offCode, active: false));

        Assert.True(byDefault.Active);
        Assert.False(switchedOff.Active);
        var stored = await Read<VehicleMakeDto>(await client.GetAsync($"{Url}/{offCode}", Cancellation));
        Assert.False(stored.Active);
    }

    [Fact]
    public async Task Turning_active_off_and_on_again_retires_and_restores_a_make_without_deleting_it()
    {
        var code = NewCode();
        await Create(code, "Keep Me", "Keep");

        var off = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeName = "Keep Me", shortName = "Keep", active = false },
            Cancellation);
        var stillReadable = await client.GetAsync($"{Url}/{code}", Cancellation);
        var on = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeName = "Keep Me", shortName = "Keep", active = true },
            Cancellation);

        Assert.False((await Read<VehicleMakeDto>(off)).Active);
        Assert.Equal(HttpStatusCode.OK, stillReadable.StatusCode);
        Assert.False((await Read<VehicleMakeDto>(stillReadable)).Active);
        Assert.True((await Read<VehicleMakeDto>(on)).Active);
    }

    [Fact]
    public async Task An_update_that_does_not_mention_active_leaves_the_status_unchanged()
    {
        var code = NewCode();
        await Create(code, active: false);

        var response = await client.PutAsJsonAsync(
            $"{Url}/{code}",
            new { makeName = "Renamed", shortName = "Ren" },
            Cancellation);

        Assert.False((await Read<VehicleMakeDto>(response)).Active);
    }

    [Fact]
    public async Task Inactive_makes_stay_in_the_list_and_show_their_status()
    {
        var runId = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
        factory.Track($"ZT{runId}01");
        factory.Track($"ZT{runId}02");
        await Create($"ZT{runId}01", "Make 01", "M01", active: true);
        await Create($"ZT{runId}02", "Make 02", "M02", active: false);

        var result = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?makeCode={runId}", Cancellation));

        Assert.Equal(new[] { true, false }, result.Items.Select(item => item.Active));
    }

    // Creates makes ZT<run>01.. with the given (name, short name, active) and returns the run id that finds them all.
    private async Task<string> MakesForFiltering(params (string Name, string Short, bool Active)[] makes)
    {
        var runId = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
        for (var index = 0; index < makes.Length; index++)
        {
            var code = factory.Track($"ZT{runId}{index + 1:00}");
            await Create(code, makes[index].Name, makes[index].Short, active: makes[index].Active);
        }

        return runId;
    }

    private async Task<List<string>> FilteredCodes(string query)
    {
        var result = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?{query}", Cancellation));
        return result.Items.Select(item => item.MakeCode[^2..]).ToList();
    }

    [Theory]
    [InlineData("startsWith", "toy", "01")]
    [InlineData("endsWith", "MOTOR", "02")]
    [InlineData("contains", "ond", "03")]
    [InlineData("equals", "honda", "03")]
    [InlineData("notEquals", "honda", "01,02")]
    public async Task Every_operator_filters_the_name_column_ignoring_case(string op, string text, string expected)
    {
        var runId = await MakesForFiltering(
            ("Toyota", "Toy", true),
            ("Hyundai Motor", "Hyu", true),
            ("Honda", "Hon", true));

        var codes = await FilteredCodes($"makeCode={runId}&makeName={text}&makeNameOperator={op}");

        Assert.Equal(expected.Split(','), codes);
    }

    [Fact]
    public async Task Filters_on_several_columns_must_all_match_and_blank_filters_are_ignored()
    {
        var runId = await MakesForFiltering(
            ("Toyota", "Toy", true),
            ("Toyota Hilux", "Hil", false),
            ("Honda", "Hon", true));

        var both = await FilteredCodes($"makeCode={runId}&makeName=toyota&shortName=hil");
        var withBlankFilter = await FilteredCodes($"makeCode={runId}&makeName=&makeNameOperator=equals");

        Assert.Equal(new[] { "02" }, both);
        Assert.Equal(new[] { "01", "02", "03" }, withBlankFilter);
    }

    [Fact]
    public async Task The_status_filter_finds_active_or_inactive_makes_and_notEquals_reverses_it()
    {
        var runId = await MakesForFiltering(
            ("One", "One", true),
            ("Two", "Two", false),
            ("Three", "Thr", true));

        var active = await FilteredCodes($"makeCode={runId}&active=true");
        var inactive = await FilteredCodes($"makeCode={runId}&active=false&activeOperator=equals");
        var notInactive = await FilteredCodes($"makeCode={runId}&active=false&activeOperator=notEquals");

        Assert.Equal(new[] { "01", "03" }, active);
        Assert.Equal(new[] { "02" }, inactive);
        Assert.Equal(new[] { "01", "03" }, notInactive);
    }

    [Fact]
    public async Task Pattern_characters_are_matched_literally_never_as_wildcards()
    {
        var runId = await MakesForFiltering(
            ("Plain Name", "Plain", true),
            ("Half 50% Off", "Half", true),
            ("Under_score", "Under", true));

        var percent = await FilteredCodes($"makeCode={runId}&makeName={Uri.EscapeDataString("%")}");
        var underscore = await FilteredCodes($"makeCode={runId}&makeName={Uri.EscapeDataString("_")}");
        var wildcardShape = await FilteredCodes($"makeCode={runId}&makeName={Uri.EscapeDataString("P%e")}");

        Assert.Equal(new[] { "02" }, percent);
        Assert.Equal(new[] { "03" }, underscore);
        Assert.Empty(wildcardShape);
    }

    [Fact]
    public async Task Filters_apply_to_every_record_before_paging_not_just_the_page_shown()
    {
        var runId = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
        for (var number = 1; number <= 15; number++)
        {
            factory.Track($"ZT{runId}{number:00}");
            await Create($"ZT{runId}{number:00}", number == 14 ? "Needle" : "Hay", $"S{number:00}");
        }

        var result = await Read<PaginatedResult<VehicleMakeListItemDto>>(
            await client.GetAsync($"{Url}?makeCode={runId}&makeName=needle", Cancellation));

        // The needle is the 14th make, which sits on page 2 of the unfiltered list.
        Assert.Equal(1, result.TotalCount);
        Assert.Equal($"ZT{runId}14", Assert.Single(result.Items).MakeCode);
    }

    [Fact]
    public async Task The_old_search_parameter_no_longer_filters_anything()
    {
        var runId = await MakesForFiltering(("One", "One", true), ("Two", "Two", true));

        var codes = await FilteredCodes($"makeCode={runId}&search=NOTHING-MATCHES-THIS");

        Assert.Equal(new[] { "01", "02" }, codes);
    }

    [Theory]
    [InlineData("makeCodeOperator=beginsWith", "makeCodeOperator")]
    [InlineData("makeNameOperator=like", "makeNameOperator")]
    [InlineData("shortNameOperator=%25", "shortNameOperator")]
    [InlineData("activeOperator=startsWith", "activeOperator")]
    public async Task An_operator_that_is_not_allowed_is_refused_with_the_parameter_named(string query, string field)
    {
        var response = await client.GetAsync($"{Url}?{query}", Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        Assert.False(string.IsNullOrEmpty(await FirstErrorFor(response, field)));
    }
}
