using SDD.API.Data.Scaffolded;
using SDD.API.Services;

namespace SDD.API.Tests.VehicleMakes;

public class VehicleMakeListQueryTests
{
    private static BrmVehMake Make(string code, string? name, string? shortName, string? active = null) =>
        new() { VmakCode = code, VmakName = name, VmakShortName = shortName, VmakActiveYn = active };

    // 25 makes, so the data spans three pages of ten.
    private static IQueryable<BrmVehMake> ManyMakes() =>
        Enumerable.Range(1, 25)
            .Select(number => Make($"M{number:00}", $"Make {26 - number:00}", $"S{number:00}"))
            .AsQueryable();

    private static IQueryable<BrmVehMake> NamedMakes() =>
        new[]
        {
            Make("TOY", "Toyota", "Toyota"),
            Make("HON", "Honda Motor", "Honda"),
            Make("BMW", "Bayerische Motoren Werke", "BMW"),
            Make("OLD", null, null)
        }.AsQueryable();

    private static List<string> Codes(IQueryable<BrmVehMake> query) =>
        query.Select(make => make.VmakCode).ToList();

    private static ColumnFilters Filters(
        TextFilter? code = null,
        TextFilter? name = null,
        TextFilter? shortName = null,
        StatusFilter? status = null) =>
        new(code ?? new TextFilter(), name ?? new TextFilter(), shortName ?? new TextFilter(), status ?? new StatusFilter());

    private static List<string> Filtered(IQueryable<BrmVehMake> source, ColumnFilters filters) =>
        Codes(VehicleMakeListQuery.Apply(source, filters, null, null));

    [Fact]
    public void The_list_is_sorted_by_make_code_ascending_unless_told_otherwise()
    {
        var codes = Codes(VehicleMakeListQuery.Apply(NamedMakes(), ColumnFilters.None, null, null));

        Assert.Equal(new[] { "BMW", "HON", "OLD", "TOY" }, codes);
    }

    [Fact]
    public void Sorting_by_name_descending_covers_every_record_not_just_one_page()
    {
        var codes = Codes(VehicleMakeListQuery.Apply(ManyMakes(), ColumnFilters.None, "makeName", "desc"));

        // "Make 25" is the highest name and belongs to M01, the very first make.
        Assert.Equal("M01", codes[0]);
        Assert.Equal("M25", codes[^1]);
        Assert.Equal(25, codes.Count);
    }

    [Fact]
    public void Sort_column_names_are_not_case_sensitive()
    {
        var codes = Codes(VehicleMakeListQuery.Apply(ManyMakes(), ColumnFilters.None, "SHORTNAME", "DESC"));

        // Short names run S01 to S25 in step with the codes, so a descending sort starts at M25.
        Assert.Equal("M25", codes[0]);
    }

    [Fact]
    public void A_filter_finds_a_make_that_would_be_on_a_later_page()
    {
        var codes = Filtered(ManyMakes(), Filters(code: new TextFilter("m24")));

        Assert.Equal(new[] { "M24" }, codes);
    }

    [Theory]
    [InlineData("toy", "TOY")]
    [InlineData("MOTOREN", "BMW")]
    [InlineData("  honda  ", "HON")]
    [InlineData("bmw", "BMW")]
    public void Contains_is_the_default_operator_and_ignores_case_and_surrounding_spaces(string text, string expectedCode)
    {
        var onName = Filtered(NamedMakes(), Filters(name: new TextFilter(text)));
        var onShortName = Filtered(NamedMakes(), Filters(shortName: new TextFilter(text)));

        Assert.True(onName.Contains(expectedCode) || onShortName.Contains(expectedCode));
    }

    [Theory]
    [InlineData("startsWith", "bay", "BMW")]
    [InlineData("STARTSWITH", "HONDA", "HON")]
    [InlineData("endsWith", "motor", "HON")]
    [InlineData("endsWith", "werke", "BMW")]
    [InlineData("contains", "oren", "BMW")]
    [InlineData("equals", "  toyota ", "TOY")]
    [InlineData("equals", "HONDA MOTOR", "HON")]
    public void Each_operator_matches_only_what_it_should_on_the_name_column(string op, string text, string expectedCode)
    {
        var codes = Filtered(NamedMakes(), Filters(name: new TextFilter(text, op)));

        Assert.Equal(new[] { expectedCode }, codes);
    }

    [Fact]
    public void Equals_needs_the_whole_value_not_just_part_of_it()
    {
        Assert.Empty(Filtered(NamedMakes(), Filters(name: new TextFilter("honda", "equals"))));
    }

    [Fact]
    public void Not_equal_to_also_lists_makes_whose_value_is_empty()
    {
        var codes = Filtered(NamedMakes(), Filters(name: new TextFilter("toyota", "notEquals")));

        // OLD has no name at all, and "not equal to Toyota" includes it (owner decision, 30-Oct-2026).
        Assert.Equal(new[] { "BMW", "HON", "OLD" }, codes);
    }

    [Theory]
    [InlineData("startsWith")]
    [InlineData("endsWith")]
    [InlineData("contains")]
    [InlineData("equals")]
    public void The_other_operators_never_match_a_make_with_no_value(string op)
    {
        var codes = Filtered(NamedMakes(), Filters(name: new TextFilter("a", op), shortName: new TextFilter("a", op)));

        Assert.DoesNotContain("OLD", codes);
    }

    [Fact]
    public void Filters_on_several_columns_must_all_match()
    {
        var codes = Filtered(
            NamedMakes(),
            Filters(code: new TextFilter("o"), name: new TextFilter("h", "startsWith")));

        // Codes containing "o": TOY, HON, OLD. Of those only HON has a name starting with "h".
        Assert.Equal(new[] { "HON" }, codes);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void A_blank_filter_is_ignored_even_when_an_operator_is_chosen(string? text)
    {
        var codes = Filtered(NamedMakes(), Filters(name: new TextFilter(text, "equals"), code: new TextFilter(text, "notEquals")));

        Assert.Equal(4, codes.Count);
    }

    [Fact]
    public void Characters_that_look_like_search_patterns_are_matched_as_plain_text()
    {
        var makes = new[]
        {
            Make("A", "Plain", "P"),
            Make("B", "Half 50% Off", "H"),
            Make("C", "Under_score", "U")
        }.AsQueryable();

        Assert.Equal(new[] { "B" }, Filtered(makes, Filters(name: new TextFilter("%"))));
        Assert.Equal(new[] { "C" }, Filtered(makes, Filters(name: new TextFilter("_"))));
        Assert.Empty(Filtered(makes, Filters(name: new TextFilter("p%n"))));
    }

    [Fact]
    public void The_status_filter_finds_active_or_inactive_and_a_missing_flag_counts_as_active()
    {
        var makes = new[]
        {
            Make("A", "On", "On", "Y"),
            Make("B", "Off", "Off", "N"),
            Make("C", "Never set", "None", null)
        }.AsQueryable();

        Assert.Equal(new[] { "A", "C" }, Filtered(makes, Filters(status: new StatusFilter(true))));
        Assert.Equal(new[] { "B" }, Filtered(makes, Filters(status: new StatusFilter(false, "equals"))));
        Assert.Equal(new[] { "B" }, Filtered(makes, Filters(status: new StatusFilter(true, "notEquals"))));
        Assert.Equal(new[] { "A", "C" }, Filtered(makes, Filters(status: new StatusFilter(false, "NOTEQUALS"))));
        Assert.Equal(3, Filtered(makes, Filters(status: new StatusFilter(null, "equals"))).Count);
    }

    [Fact]
    public void Pages_of_ten_cover_all_records_exactly_once()
    {
        var ordered = VehicleMakeListQuery.Apply(ManyMakes(), ColumnFilters.None, null, null);

        var seen = new List<string>();
        for (var page = 1; page <= 3; page++)
        {
            seen.AddRange(Codes(ordered.Skip((page - 1) * VehicleMakeListQuery.PageSize).Take(VehicleMakeListQuery.PageSize)));
        }

        Assert.Equal(25, seen.Distinct().Count());
        Assert.Equal(25, seen.Count);
    }

    [Fact]
    public void Valid_options_produce_no_errors()
    {
        Assert.Empty(VehicleMakeListQuery.Validate(1, ColumnFilters.None, "shortName", "desc"));
        Assert.Empty(VehicleMakeListQuery.Validate(3, ColumnFilters.None, null, null));
        Assert.Empty(VehicleMakeListQuery.Validate(
            1,
            Filters(
                code: new TextFilter("a", "startsWith"),
                name: new TextFilter("a", "ENDSWITH"),
                shortName: new TextFilter("a", "notEquals"),
                status: new StatusFilter(true, "notEquals")),
            null,
            null));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(VehicleMakeListQuery.MaximumPage + 1)]
    public void A_page_outside_the_allowed_range_is_rejected(int page)
    {
        Assert.Contains("page", VehicleMakeListQuery.Validate(page, ColumnFilters.None, null, null).Keys);
    }

    [Fact]
    public void An_operator_that_is_not_allowed_is_rejected_and_named_by_its_parameter()
    {
        var errors = VehicleMakeListQuery.Validate(
            1,
            Filters(
                code: new TextFilter("a", "beginsWith"),
                name: new TextFilter("a", "like"),
                shortName: new TextFilter("a", "%"),
                status: new StatusFilter(true, "contains")),
            null,
            null);

        Assert.Contains("makeCodeOperator", errors.Keys);
        Assert.Contains("makeNameOperator", errors.Keys);
        Assert.Contains("shortNameOperator", errors.Keys);
        Assert.Contains("activeOperator", errors.Keys);
    }

    [Fact]
    public void Only_the_three_listed_columns_can_be_sorted_on()
    {
        Assert.Contains("sortBy", VehicleMakeListQuery.Validate(1, ColumnFilters.None, "remarks", null).Keys);
        Assert.Contains("sortBy", VehicleMakeListQuery.Validate(1, ColumnFilters.None, "VMAK_CODE; DROP TABLE", null).Keys);
    }

    [Fact]
    public void Only_asc_and_desc_are_accepted_as_a_direction()
    {
        Assert.Contains("sortDirection", VehicleMakeListQuery.Validate(1, ColumnFilters.None, null, "sideways").Keys);
    }
}
