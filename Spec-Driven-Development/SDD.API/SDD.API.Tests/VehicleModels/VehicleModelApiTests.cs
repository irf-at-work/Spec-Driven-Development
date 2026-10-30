using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using SDD.API.Contracts;
using SDD.API.DTOs;
using SDD.API.Tests.VehicleMakes;

namespace SDD.API.Tests.VehicleModels;

/// <summary>
/// Runs against the real API and the Oracle test schema. Needs BRM_VEH_MODEL and STD_LIST_ITEM to exist there.
/// Every make a test creates starts with "ZT" and is removed afterwards (with its models first, because a make that
/// still has models cannot be deleted).
/// </summary>
[Collection("Oracle API")]
public class VehicleModelApiTests(OracleApiFactory factory)
{
    private const string MakesUrl = "/api/vehicle-makes";

    private readonly HttpClient client = factory.CreateClient();

    private static CancellationToken Cancellation => TestContext.Current.CancellationToken;

    private async Task<string> NewMake()
    {
        var code = factory.Track(("ZT" + Guid.NewGuid().ToString("N")[..10]).ToUpperInvariant());
        var response = await client.PostAsJsonAsync(
            MakesUrl,
            new { makeCode = code, makeName = "Test Make", shortName = "Test" },
            Cancellation);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return code;
    }

    private Task<HttpResponseMessage> CreateModel(string makeCode, string modelCode, object? extra = null) =>
        client.PostAsJsonAsync(
            $"{MakesUrl}/{makeCode}/models",
            extra ?? new { modelCode, modelName = "Test Model", shortName = "Test" },
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
    public async Task Creating_a_model_saves_it_in_capitals_with_tidy_names_active_and_stamped_admin()
    {
        var makeCode = await NewMake();

        var response = await CreateModel(makeCode, "x5-m", new { modelCode = "x5-m", modelName = "x5   sport", shortName = "X5" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var model = await Read<VehicleModelDto>(response);
        Assert.Equal(makeCode, model.MakeCode);
        Assert.Equal("X5-M", model.ModelCode);
        Assert.Equal("X5 Sport", model.ModelName);
        Assert.True(model.Active);
        Assert.Equal("admin", model.CreatedBy);
        Assert.Equal("admin", model.LastChangedBy);
    }

    [Fact]
    public async Task Numbers_and_the_amount_are_saved_and_returned_as_entered()
    {
        var makeCode = await NewMake();

        var response = await CreateModel(
            makeCode,
            "N1",
            new
            {
                modelCode = "N1",
                modelName = "Numbers",
                shortName = "Num",
                engineCapacity = 1998,
                seats = 5,
                passengers = 4,
                drivers = 1,
                makeYear = 2024,
                value = 85000.5m,
                weight = "1500 kg"
            });

        var model = await Read<VehicleModelDto>(response);
        Assert.Equal(1998, model.EngineCapacity);
        Assert.Equal(5, model.Seats);
        Assert.Equal(4, model.Passengers);
        Assert.Equal(1, model.Drivers);
        Assert.Equal(2024, model.MakeYear);
        Assert.Equal(85000.5m, model.Value);
        Assert.Equal("1500 kg", model.Weight);
    }

    [Fact]
    public async Task The_same_model_code_is_refused_within_a_make_but_allowed_under_another_make()
    {
        var firstMake = await NewMake();
        var secondMake = await NewMake();
        await CreateModel(firstMake, "DUP");

        var again = await CreateModel(firstMake, "DUP");
        var elsewhere = await CreateModel(secondMake, "DUP");

        Assert.Equal(HttpStatusCode.Conflict, again.StatusCode);
        Assert.Equal("This model code already exists for this make.", await FirstErrorFor(again, "modelCode"));
        Assert.Equal(HttpStatusCode.OK, elsewhere.StatusCode);
    }

    [Fact]
    public async Task Invalid_values_are_refused_and_nothing_is_saved()
    {
        var makeCode = await NewMake();

        var response = await CreateModel(
            makeCode,
            "BAD",
            new { modelCode = "BAD", modelName = " ", shortName = " " });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Model name is required.", await FirstErrorFor(response, "modelName"));

        var overLimit = await CreateModel(
            makeCode,
            "TOO-LONG-MODEL",
            new
            {
                modelCode = new string('M', 13),
                modelName = new string('N', 101),
                shortName = new string('S', 31),
                remarks = new string('R', 2001),
                arabicModelName = new string('ع', 101),
                arabicShortName = new string('ع', 31),
                arabicRemarks = new string('ع', 2001),
                variant = new string('V', 13),
                vehicleType = new string('T', 13),
                weight = new string('W', 101),
                loadCapacity = new string('L', 101),
                bodyType = new string('B', 13),
                fuelType = new string('F', 13),
                engineCapacity = -1,
                cylinders = new string('C', 13),
                seats = 1000,
                passengers = -1,
                drivers = 1000,
                doors = new string('D', 13),
                makeYear = 10000,
                drivingType = new string('D', 13),
                bodyColour = new string('C', 13),
                value = -0.01m,
                category = new string('C', 13)
            });

        Assert.Equal(HttpStatusCode.BadRequest, overLimit.StatusCode);
        using (var document = JsonDocument.Parse(await overLimit.Content.ReadAsStringAsync(Cancellation)))
        {
            var errors = document.RootElement.GetProperty("errors");
            foreach (var field in new[]
                     {
                         "modelCode", "modelName", "shortName", "remarks", "arabicModelName", "arabicShortName",
                         "arabicRemarks", "variant", "vehicleType", "weight", "loadCapacity", "bodyType",
                         "fuelType", "engineCapacity", "cylinders", "seats", "passengers", "drivers", "doors",
                         "makeYear", "drivingType", "bodyColour", "value", "category"
                     })
            {
                Assert.True(errors.TryGetProperty(field, out _), $"Expected an error for {field}.");
            }
        }

        var list = await Read<PaginatedResult<VehicleModelDto>>(await client.GetAsync($"{MakesUrl}/{makeCode}/models", Cancellation));
        Assert.Empty(list.Items);
    }

    [Fact]
    public async Task A_dropdown_code_that_is_not_an_active_item_of_its_list_is_refused()
    {
        var makeCode = await NewMake();

        var response = await CreateModel(
            makeCode,
            "OPT",
            new { modelCode = "OPT", modelName = "Options", shortName = "Opt", fuelType = "NO-SUCH-FUEL" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("Please choose a fuel type from the list.", await FirstErrorFor(response, "fuelType"));
    }

    [Fact]
    public async Task The_options_endpoint_returns_all_nine_lists()
    {
        var response = await client.GetAsync("/api/vehicle-model-options", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        foreach (var list in new[]
                 {
                     "variants", "vehicleTypes", "bodyTypes", "fuelTypes", "cylinders",
                     "doors", "drivingTypes", "bodyColours", "categories"
                 })
        {
            Assert.Equal(JsonValueKind.Array, document.RootElement.GetProperty(list).ValueKind);
        }
    }

    [Fact]
    public async Task Models_are_listed_for_their_own_make_only_ten_per_page_in_code_order()
    {
        var makeCode = await NewMake();
        var otherMake = await NewMake();
        for (var number = 1; number <= 12; number++)
        {
            await CreateModel(makeCode, $"M{number:00}");
        }

        await CreateModel(otherMake, "OTHER");

        var first = await Read<PaginatedResult<VehicleModelDto>>(await client.GetAsync($"{MakesUrl}/{makeCode}/models?page=1", Cancellation));
        var second = await Read<PaginatedResult<VehicleModelDto>>(await client.GetAsync($"{MakesUrl}/{makeCode}/models?page=2", Cancellation));

        Assert.Equal(12, first.TotalCount);
        Assert.Equal(10, first.Items.Count);
        Assert.Equal(2, second.Items.Count);
        Assert.Equal("M01", first.Items[0].ModelCode);
        Assert.Equal("M12", second.Items[^1].ModelCode);
        Assert.DoesNotContain(first.Items.Concat(second.Items), model => model.ModelCode == "OTHER");
    }

    [Fact]
    public async Task Updating_changes_the_details_and_can_turn_Active_off_without_removing_the_model()
    {
        var makeCode = await NewMake();
        var makeUpdate = await client.PutAsJsonAsync(
            $"{MakesUrl}/{makeCode}",
            new { makeName = "Test Make", shortName = "Test", active = false },
            Cancellation);
        Assert.Equal(HttpStatusCode.OK, makeUpdate.StatusCode);

        var created = await Read<VehicleModelDto>(await CreateModel(makeCode, "UPD"));
        Assert.True(created.Active);
        Assert.Equal("admin", created.CreatedBy);
        Assert.Equal("admin", created.LastChangedBy);

        var response = await client.PutAsJsonAsync(
            $"{MakesUrl}/{makeCode}/models/upd",
            new { modelCode = "CHANGED", modelName = "new name", shortName = "New", seats = 7, active = false },
            Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await Read<VehicleModelDto>(response);
        Assert.Equal("UPD", updated.ModelCode);
        Assert.Equal("New Name", updated.ModelName);
        Assert.Equal(7, updated.Seats);
        Assert.False(updated.Active);
        Assert.Equal("admin", updated.CreatedBy);
        Assert.Equal("admin", updated.LastChangedBy);
        var make = await Read<VehicleMakeDto>(await client.GetAsync($"{MakesUrl}/{makeCode}", Cancellation));
        Assert.False(make.Active);

        var list = await Read<PaginatedResult<VehicleModelDto>>(await client.GetAsync($"{MakesUrl}/{makeCode}/models", Cancellation));
        var listed = Assert.Single(list.Items);
        Assert.False(listed.Active);
    }

    [Fact]
    public async Task Updating_a_model_that_does_not_exist_reports_not_found()
    {
        var makeCode = await NewMake();

        var response = await client.PutAsJsonAsync(
            $"{MakesUrl}/{makeCode}/models/NOPE",
            new { modelName = "Name", shortName = "Short" },
            Cancellation);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Models_of_a_make_that_does_not_exist_are_reported_as_not_found()
    {
        var list = await client.GetAsync($"{MakesUrl}/ZTNOSUCHMAKE/models", Cancellation);
        var create = await CreateModel("ZTNOSUCHMAKE", "X");

        Assert.Equal(HttpStatusCode.NotFound, list.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, create.StatusCode);
    }

    [Fact]
    public async Task Deleting_a_model_removes_only_that_model_and_a_second_delete_reports_not_found()
    {
        var makeCode = await NewMake();
        await CreateModel(makeCode, "KEEP");
        await CreateModel(makeCode, "GONE");

        var deleted = await client.DeleteAsync($"{MakesUrl}/{makeCode}/models/GONE", Cancellation);
        var deletedAgain = await client.DeleteAsync($"{MakesUrl}/{makeCode}/models/GONE", Cancellation);

        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, deletedAgain.StatusCode);
        var list = await Read<PaginatedResult<VehicleModelDto>>(await client.GetAsync($"{MakesUrl}/{makeCode}/models", Cancellation));
        Assert.Equal("KEEP", Assert.Single(list.Items).ModelCode);
    }

    [Fact]
    public async Task A_make_that_still_has_models_cannot_be_deleted_until_they_are_removed()
    {
        var makeCode = await NewMake();
        await CreateModel(makeCode, "CHILD");

        var refused = await client.DeleteAsync($"{MakesUrl}/{makeCode}", Cancellation);

        Assert.Equal(HttpStatusCode.Conflict, refused.StatusCode);
        Assert.Contains("Delete its models first", await FirstErrorFor(refused, "makeCode"));
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync($"{MakesUrl}/{makeCode}", Cancellation)).StatusCode);

        await client.DeleteAsync($"{MakesUrl}/{makeCode}/models/CHILD", Cancellation);
        var allowed = await client.DeleteAsync($"{MakesUrl}/{makeCode}", Cancellation);

        Assert.Equal(HttpStatusCode.NoContent, allowed.StatusCode);
    }

    private static async Task<string> ProblemTitle(HttpResponseMessage response)
    {
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(Cancellation));
        return document.RootElement.GetProperty("title").GetString()!;
    }

    [Fact]
    public async Task One_model_can_be_read_back_by_its_make_and_model_code_in_any_case()
    {
        var makeCode = await NewMake();
        await CreateModel(
            makeCode,
            "GET1",
            new { modelCode = "GET1", modelName = "Read Me", shortName = "Read", seats = 5, active = false });

        var response = await client.GetAsync($"{MakesUrl}/{makeCode.ToLowerInvariant()}/models/get1", Cancellation);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var model = await Read<VehicleModelDto>(response);
        Assert.Equal(makeCode, model.MakeCode);
        Assert.Equal("GET1", model.ModelCode);
        Assert.Equal("Read Me", model.ModelName);
        Assert.Equal(5, model.Seats);
        Assert.False(model.Active);
        Assert.Equal("admin", model.CreatedBy);
    }

    [Fact]
    public async Task Reading_one_model_reports_which_of_the_make_or_the_model_was_not_found()
    {
        var makeCode = await NewMake();

        var noModel = await client.GetAsync($"{MakesUrl}/{makeCode}/models/NOPE", Cancellation);
        var noMake = await client.GetAsync($"{MakesUrl}/ZTNOSUCHMAKE/models/NOPE", Cancellation);

        Assert.Equal(HttpStatusCode.NotFound, noModel.StatusCode);
        Assert.Equal("application/problem+json", noModel.Content.Headers.ContentType?.MediaType);
        Assert.Equal("Vehicle model not found", await ProblemTitle(noModel));
        Assert.Equal(HttpStatusCode.NotFound, noMake.StatusCode);
        Assert.Equal("Vehicle make not found", await ProblemTitle(noMake));
    }

    [Fact]
    public async Task A_model_is_not_found_under_a_different_make_than_its_own()
    {
        var firstMake = await NewMake();
        var secondMake = await NewMake();
        await CreateModel(firstMake, "MINE");

        var response = await client.GetAsync($"{MakesUrl}/{secondMake}/models/MINE", Cancellation);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("Vehicle model not found", await ProblemTitle(response));
    }

    private async Task<string> MakeWithModels(params (string Code, string Name, string Short, bool Active)[] models)
    {
        var makeCode = await NewMake();
        foreach (var (code, name, shortName, active) in models)
        {
            var response = await CreateModel(
                makeCode,
                code,
                new { modelCode = code, modelName = name, shortName, active });
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        return makeCode;
    }

    private async Task<List<string>> FilteredModelCodes(string makeCode, string query)
    {
        var result = await Read<PaginatedResult<VehicleModelDto>>(
            await client.GetAsync($"{MakesUrl}/{makeCode}/models?{query}", Cancellation));
        return result.Items.Select(item => item.ModelCode).ToList();
    }

    [Theory]
    [InlineData("modelNameOperator=startsWith&modelName=x5", "X5")]
    [InlineData("modelNameOperator=endsWith&modelName=AVANT", "A4")]
    [InlineData("modelName=state", "B2")]
    [InlineData("modelNameOperator=equals&modelName=b2%20estate", "B2")]
    [InlineData("modelNameOperator=notEquals&modelName=b2%20estate", "A4,X5")]
    [InlineData("modelCodeOperator=startsWith&modelCode=a", "A4")]
    [InlineData("shortNameOperator=equals&shortName=x5", "X5")]
    public async Task The_model_columns_can_be_filtered_with_every_operator_ignoring_case(string query, string expected)
    {
        var makeCode = await MakeWithModels(
            ("X5", "X5 Sport", "X5", true),
            ("A4", "A4 Avant", "A4", true),
            ("B2", "B2 Estate", "B2", true));

        var codes = await FilteredModelCodes(makeCode, query);

        Assert.Equal(expected.Split(','), codes);
    }

    [Fact]
    public async Task The_model_status_filter_and_combined_filters_work_and_blank_filters_are_ignored()
    {
        var makeCode = await MakeWithModels(
            ("X5", "Sport One", "S1", true),
            ("A4", "Sport Two", "S2", false),
            ("B2", "Estate", "E1", true));

        var inactive = await FilteredModelCodes(makeCode, "active=false");
        var notInactive = await FilteredModelCodes(makeCode, "active=false&activeOperator=notEquals");
        var sportAndActive = await FilteredModelCodes(makeCode, "modelName=sport&active=true");
        var blank = await FilteredModelCodes(makeCode, "modelName=&modelNameOperator=equals");

        Assert.Equal(new[] { "A4" }, inactive);
        Assert.Equal(new[] { "B2", "X5" }, notInactive);
        Assert.Equal(new[] { "X5" }, sportAndActive);
        Assert.Equal(new[] { "A4", "B2", "X5" }, blank);
    }

    [Fact]
    public async Task Model_filters_see_only_this_makes_models_and_match_pattern_characters_literally()
    {
        var makeCode = await MakeWithModels(
            ("P1", "Plain", "P", true),
            ("P2", "Half 50% Off", "H", true));
        await MakeWithModels(("P3", "Half 50% Off", "H", true));

        var percent = await FilteredModelCodes(makeCode, $"modelName={Uri.EscapeDataString("%")}");
        var wildcardShape = await FilteredModelCodes(makeCode, $"modelName={Uri.EscapeDataString("P%n")}");

        Assert.Equal(new[] { "P2" }, percent);
        Assert.Empty(wildcardShape);
    }

    [Fact]
    public async Task Model_filters_apply_to_every_model_of_the_make_before_paging()
    {
        var makeCode = await NewMake();
        for (var number = 1; number <= 15; number++)
        {
            await CreateModel(
                makeCode,
                $"M{number:00}",
                new { modelCode = $"M{number:00}", modelName = number == 14 ? "Needle" : "Hay", shortName = "S" });
        }

        var result = await Read<PaginatedResult<VehicleModelDto>>(
            await client.GetAsync($"{MakesUrl}/{makeCode}/models?modelName=needle", Cancellation));

        // The needle is the 14th model, which sits on page 2 of the unfiltered list.
        Assert.Equal(1, result.TotalCount);
        Assert.Equal("M14", Assert.Single(result.Items).ModelCode);
    }

    [Theory]
    [InlineData("modelCodeOperator=beginsWith", "modelCodeOperator")]
    [InlineData("modelNameOperator=like", "modelNameOperator")]
    [InlineData("shortNameOperator=nope", "shortNameOperator")]
    [InlineData("activeOperator=contains", "activeOperator")]
    public async Task A_model_filter_operator_that_is_not_allowed_is_refused_with_the_parameter_named(string query, string field)
    {
        var makeCode = await NewMake();

        var response = await client.GetAsync($"{MakesUrl}/{makeCode}/models?{query}", Cancellation);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        Assert.False(string.IsNullOrEmpty(await FirstErrorFor(response, field)));
    }
}
