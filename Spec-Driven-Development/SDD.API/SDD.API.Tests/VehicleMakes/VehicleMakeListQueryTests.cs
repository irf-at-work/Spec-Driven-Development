using SDD.API.Data.Scaffolded;
using SDD.API.Services;

namespace SDD.API.Tests.VehicleMakes;

public class VehicleMakeListQueryTests
{
    private static BrmVehMake Make(string code, string? name, string? shortName) =>
        new() { VmakCode = code, VmakName = name, VmakShortName = shortName };

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

    [Fact]
    public void The_list_is_sorted_by_make_code_ascending_unless_told_otherwise()
    {
        var codes = Codes(VehicleMakeListQuery.Apply(NamedMakes(), null, null, null));

        Assert.Equal(new[] { "BMW", "HON", "OLD", "TOY" }, codes);
    }

    [Fact]
    public void Sorting_by_name_descending_covers_every_record_not_just_one_page()
    {
        var codes = Codes(VehicleMakeListQuery.Apply(ManyMakes(), null, "makeName", "desc"));

        // "Make 25" is the highest name and belongs to M01, the very first make.
        Assert.Equal("M01", codes[0]);
        Assert.Equal("M25", codes[^1]);
        Assert.Equal(25, codes.Count);
    }

    [Fact]
    public void Sort_column_names_are_not_case_sensitive()
    {
        var codes = Codes(VehicleMakeListQuery.Apply(ManyMakes(), null, "SHORTNAME", "DESC"));

        // Short names run S01 to S25 in step with the codes, so a descending sort starts at M25.
        Assert.Equal("M25", codes[0]);
    }

    [Fact]
    public void Search_finds_a_make_that_would_be_on_a_later_page()
    {
        var query = VehicleMakeListQuery.Apply(ManyMakes(), "m24", null, null);

        Assert.Equal(new[] { "M24" }, Codes(query));
    }

    [Theory]
    [InlineData("toy", "TOY")]
    [InlineData("MOTOREN", "BMW")]
    [InlineData("  honda  ", "HON")]
    [InlineData("bmw", "BMW")]
    public void Search_ignores_case_and_matches_code_name_and_short_name(string search, string expectedCode)
    {
        var query = VehicleMakeListQuery.Apply(NamedMakes(), search, null, null);

        Assert.Equal(new[] { expectedCode }, Codes(query));
    }

    [Fact]
    public void Search_does_not_fail_on_makes_with_no_name()
    {
        var query = VehicleMakeListQuery.Apply(NamedMakes(), "zzz", null, null);

        Assert.Empty(Codes(query));
    }

    [Fact]
    public void A_blank_search_returns_everything()
    {
        Assert.Equal(4, Codes(VehicleMakeListQuery.Apply(NamedMakes(), "   ", null, null)).Count);
    }

    [Fact]
    public void Pages_of_ten_cover_all_records_exactly_once()
    {
        var ordered = VehicleMakeListQuery.Apply(ManyMakes(), null, null, null);

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
        Assert.Empty(VehicleMakeListQuery.Validate(1, "shortName", "desc"));
        Assert.Empty(VehicleMakeListQuery.Validate(3, null, null));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(VehicleMakeListQuery.MaximumPage + 1)]
    public void A_page_outside_the_allowed_range_is_rejected(int page)
    {
        Assert.Contains("page", VehicleMakeListQuery.Validate(page, null, null).Keys);
    }

    [Fact]
    public void Only_the_three_listed_columns_can_be_sorted_on()
    {
        Assert.Contains("sortBy", VehicleMakeListQuery.Validate(1, "remarks", null).Keys);
        Assert.Contains("sortBy", VehicleMakeListQuery.Validate(1, "VMAK_CODE; DROP TABLE", null).Keys);
    }

    [Fact]
    public void Only_asc_and_desc_are_accepted_as_a_direction()
    {
        Assert.Contains("sortDirection", VehicleMakeListQuery.Validate(1, null, "sideways").Keys);
    }
}
