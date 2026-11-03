using System.Linq.Expressions;
using System.Net;
using SDD.API.Services;
using SDD.API.Tests.VehicleMakes;

namespace SDD.API.Tests.PremiumAdjustments;

public sealed class ColumnFiltersGeneralisedTests
{
    private sealed record FilterRow(
        string? CodeType,
        string? Code,
        string? CompanyCode,
        string? DiscountType,
        string? ChargesType,
        string? ChargesCategory,
        string? Active);

    private static readonly IReadOnlyDictionary<string, Expression<Func<FilterRow, string?>>> TextColumns =
        new Dictionary<string, Expression<Func<FilterRow, string?>>>(StringComparer.OrdinalIgnoreCase)
        {
            ["codeType"] = row => row.CodeType,
            ["code"] = row => row.Code,
            ["companyCode"] = row => row.CompanyCode,
            ["discountType"] = row => row.DiscountType,
            ["chargesType"] = row => row.ChargesType,
            ["chargesCategory"] = row => row.ChargesCategory
        };

    private static readonly IReadOnlyDictionary<string, string> ValidationFields =
        TextColumns.Keys.ToDictionary(key => key, key => key, StringComparer.OrdinalIgnoreCase);

    private static readonly IQueryable<FilterRow> Rows = new[]
    {
        new FilterRow("Motor", "A-10", "Acme", "Premium", "Roadside", "Road", "Y"),
        new FilterRow("Health", "B_20", "Globex", "Loading fee", "Glass", null, "N"),
        new FilterRow("Travel", "50%_Off", "Northwind", null, null, null, null)
    }.AsQueryable();

    [Theory]
    [InlineData("codeType", "motor", "A-10")]
    [InlineData("code", "a-10", "A-10")]
    [InlineData("companyCode", "acme", "A-10")]
    [InlineData("discountType", "premium", "A-10")]
    [InlineData("chargesType", "roadside", "A-10")]
    [InlineData("chargesCategory", "road", "A-10")]
    public void A_list_can_apply_filters_to_each_of_its_declared_text_columns(
        string column,
        string value,
        string expectedCode)
    {
        var filters = Filters((column, new TextFilter(value)));

        var codes = ColumnFilterQuery.Apply(Rows, filters, TextColumns, row => row.Active)
            .Select(row => row.Code)
            .ToArray();

        Assert.Equal(new[] { expectedCode }, codes);
    }

    [Theory]
    [InlineData("startsWith", "premium", "A-10")]
    [InlineData("endsWith", "fee", "B_20")]
    [InlineData("contains", "MIUM", "A-10")]
    [InlineData("equals", " PREMIUM ", "A-10")]
    [InlineData("notEquals", "premium", "B_20,50%_Off")]
    public void Every_text_operator_is_supported(string op, string value, string expectedCode)
    {
        var filters = Filters(("discountType", new TextFilter(value, op)));

        var codes = ColumnFilterQuery.Apply(Rows, filters, TextColumns, row => row.Active)
            .Select(row => row.Code)
            .ToArray();

        Assert.Equal(expectedCode.Split(','), codes);
    }

    [Fact]
    public void Not_equals_includes_rows_with_an_empty_value()
    {
        var filters = Filters(("discountType", new TextFilter("premium", "notEquals")));

        var codes = ColumnFilterQuery.Apply(Rows, filters, TextColumns, row => row.Active)
            .Select(row => row.Code)
            .ToArray();

        Assert.Equal(new[] { "B_20", "50%_Off" }, codes);
    }

    [Fact]
    public void Percent_and_underscore_are_matched_as_literal_text_and_case_is_ignored()
    {
        var filters = Filters(("code", new TextFilter("%_o")));

        var codes = ColumnFilterQuery.Apply(Rows, filters, TextColumns, row => row.Active)
            .Select(row => row.Code)
            .ToArray();

        Assert.Equal(new[] { "50%_Off" }, codes);
    }

    [Fact]
    public void Blank_filters_are_ignored()
    {
        var filters = Filters(("code", new TextFilter("  ", "equals")));

        var count = ColumnFilterQuery.Apply(Rows, filters, TextColumns, row => row.Active).Count();

        Assert.Equal(3, count);
    }

    [Fact]
    public void Invalid_operator_returns_a_validation_error_for_the_declared_column()
    {
        var errors = new Dictionary<string, string[]>();
        var filters = Filters(("chargesCategory", new TextFilter("road", "regex")));

        ColumnFilterQuery.ValidateOperators(filters, ValidationFields, errors);

        Assert.Contains("chargesCategoryOperator", errors.Keys);
    }

    private static ColumnFilters Filters(params (string Column, TextFilter Filter)[] filters) =>
        new(
            filters.ToDictionary(item => item.Column, item => item.Filter, StringComparer.OrdinalIgnoreCase),
            new StatusFilter());
}

[Collection("Oracle API")]
public sealed class GeneralisedFilterApiTests(OracleApiFactory factory)
{
    [Fact]
    public async Task Invalid_operator_returns_bad_request_from_the_list_api()
    {
        using var client = factory.CreateClient();
        using var response = await client.GetAsync(
            "/api/vehicle-makes?makeCodeOperator=regex",
            TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
