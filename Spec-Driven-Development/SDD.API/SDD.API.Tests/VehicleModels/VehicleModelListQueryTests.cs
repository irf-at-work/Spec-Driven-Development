using SDD.API.Data.Scaffolded;
using SDD.API.Services;

namespace SDD.API.Tests.VehicleModels;

public class VehicleModelListQueryTests
{
    private static BrmVehModel Model(string code, string? name, string? shortName, string? active = null) =>
        new() { VmodVmakCode = "MAKE", VmodCode = code, VmodName = name, VmodShortName = shortName, VmodActiveYn = active };

    private static IQueryable<BrmVehModel> Models() =>
        new[]
        {
            Model("X5", "X5 Sport", "X5", "Y"),
            Model("A4", "A4 Avant", "A4", "N"),
            Model("C1", null, null, null),
            Model("B2", "B2 Estate", "B2", "Y")
        }.AsQueryable();

    private static ColumnFilters Filters(
        TextFilter? code = null,
        TextFilter? name = null,
        TextFilter? shortName = null,
        StatusFilter? status = null) =>
        new(code ?? new TextFilter(), name ?? new TextFilter(), shortName ?? new TextFilter(), status ?? new StatusFilter());

    private static List<string> Codes(ColumnFilters filters) =>
        VehicleModelListQuery.Apply(Models(), filters).Select(model => model.VmodCode).ToList();

    [Fact]
    public void Models_come_back_in_model_code_order_with_no_filters()
    {
        Assert.Equal(new[] { "A4", "B2", "C1", "X5" }, Codes(ColumnFilters.None));
    }

    [Theory]
    [InlineData("startsWith", "x5", "X5")]
    [InlineData("endsWith", "avant", "A4")]
    [InlineData("contains", "state", "B2")]
    [InlineData("equals", "b2 estate", "B2")]
    public void Each_operator_filters_the_name_column_ignoring_case(string op, string text, string expectedCode)
    {
        Assert.Equal(new[] { expectedCode }, Codes(Filters(name: new TextFilter(text, op))));
    }

    [Fact]
    public void Not_equal_to_also_lists_models_whose_value_is_empty()
    {
        Assert.Equal(new[] { "B2", "C1", "X5" }, Codes(Filters(name: new TextFilter("a4 avant", "notEquals"))));
    }

    [Fact]
    public void The_code_and_short_name_columns_have_their_own_filters_and_all_filters_must_match()
    {
        Assert.Equal(new[] { "A4" }, Codes(Filters(code: new TextFilter("A", "startsWith"))));
        Assert.Equal(new[] { "B2" }, Codes(Filters(shortName: new TextFilter("b2", "equals"))));
        Assert.Empty(Codes(Filters(code: new TextFilter("X"), shortName: new TextFilter("B2"))));
    }

    [Fact]
    public void The_status_filter_finds_active_and_inactive_models_and_a_missing_flag_counts_as_active()
    {
        Assert.Equal(new[] { "B2", "C1", "X5" }, Codes(Filters(status: new StatusFilter(true))));
        Assert.Equal(new[] { "A4" }, Codes(Filters(status: new StatusFilter(false))));
        Assert.Equal(new[] { "A4" }, Codes(Filters(status: new StatusFilter(true, "notEquals"))));
    }

    [Fact]
    public void Blank_filters_are_ignored()
    {
        Assert.Equal(4, Codes(Filters(name: new TextFilter("  ", "equals"))).Count);
    }

    [Fact]
    public void Operator_errors_are_named_after_the_model_parameters()
    {
        var errors = VehicleModelListQuery.Validate(
            1,
            Filters(
                code: new TextFilter("a", "nope"),
                name: new TextFilter("a", "nope"),
                shortName: new TextFilter("a", "nope"),
                status: new StatusFilter(true, "nope")));

        Assert.Contains("modelCodeOperator", errors.Keys);
        Assert.Contains("modelNameOperator", errors.Keys);
        Assert.Contains("shortNameOperator", errors.Keys);
        Assert.Contains("activeOperator", errors.Keys);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(VehicleMakeListQuery.MaximumPage + 1)]
    public void A_page_outside_the_allowed_range_is_rejected(int page)
    {
        Assert.Contains("page", VehicleModelListQuery.Validate(page, ColumnFilters.None).Keys);
    }

    [Fact]
    public void Valid_filters_and_pages_produce_no_errors()
    {
        Assert.Empty(VehicleModelListQuery.Validate(2, Filters(name: new TextFilter("a", "contains"))));
    }
}
