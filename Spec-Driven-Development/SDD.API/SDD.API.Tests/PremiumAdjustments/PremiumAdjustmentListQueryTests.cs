using SDD.API.Data.Scaffolded;
using SDD.API.Services;

namespace SDD.API.Tests.PremiumAdjustments;

public class PremiumAdjustmentListQueryTests
{
    private static IReadOnlyList<BrmMiscCode> Codes() =>
    [
        Make("A", "A01", "C01", "Bentley", "Bent", "Y"),
        Make("B", "B01", "C01", "BMW", "BMW", null),
        Make("A", "A02", "C02", "Toyota Motor", "Toyota", "N"),
        Make("MISSING", "M01", "C03", null, null, null)
    ];

    private static BrmMiscCode Make(
        string type,
        string code,
        string companyCode,
        string? name,
        string? shortName,
        string? active) =>
        new()
        {
            McType = type,
            McCode = code,
            McCompCode = companyCode,
            McDesc = name,
            McShortDesc = shortName,
            McActiveYn = active
        };

    private static IReadOnlyList<StdListItem> CodeTypes() =>
    [
        new() { LiType = "CALC_TYPE", LiCode = "A", LiDesc = "Vehicle" },
        new() { LiType = "CALC_TYPE", LiCode = "B", LiDesc = "Benefit" }
    ];

    private static ColumnFilters Filters(
        TextFilter? codeType = null,
        TextFilter? code = null,
        TextFilter? companyCode = null,
        TextFilter? name = null,
        TextFilter? shortName = null,
        StatusFilter? active = null)
    {
        var textFilters = new Dictionary<string, TextFilter>(StringComparer.OrdinalIgnoreCase);
        Add("codeType", codeType);
        Add("code", code);
        Add("companyCode", companyCode);
        Add("name", name);
        Add("shortName", shortName);
        return new ColumnFilters(textFilters, active ?? new StatusFilter());

        void Add(string key, TextFilter? filter)
        {
            if (filter is not null)
            {
                textFilters[key] = filter;
            }
        }
    }

    private static List<PremiumAdjustmentListRow> Query(
        IReadOnlyList<BrmMiscCode> codes,
        IReadOnlyList<StdListItem> codeTypes,
        ColumnFilters? filters = null,
        string? sortBy = null,
        string? sortDirection = null) =>
        PremiumAdjustmentListQuery.Apply(
                PremiumAdjustmentListQuery.JoinCodeTypes(codes.AsQueryable(), codeTypes.AsQueryable()),
                filters ?? ColumnFilters.None,
                sortBy,
                sortDirection)
            .ToList();

    [Fact]
    public void Default_sort_uses_code_type_description_then_the_composite_key()
    {
        var rows = Query(Codes(), CodeTypes());

        Assert.Equal(new[] { "B01", "M01", "A01", "A02" }, rows.Select(row => row.Code.McCode));
    }

    [Fact]
    public void Missing_code_type_description_falls_back_to_the_code_type()
    {
        var row = Assert.Single(Query(Codes(), CodeTypes()), item => item.Code.McCode == "M01");

        Assert.Equal("MISSING", row.CodeTypeDescription);
    }

    [Theory]
    [InlineData("codeType", "vehicle", "A01")]
    [InlineData("code", "a02", "A02")]
    [InlineData("companyCode", "c02", "A02")]
    [InlineData("name", "motor", "A02")]
    [InlineData("shortName", "toy", "A02")]
    public void Each_text_column_can_be_filtered_without_case_sensitivity(string column, string value, string expectedCode)
    {
        var filters = FiltersFor(column, new TextFilter(value));
        var rows = Query(Codes(), CodeTypes(), filters);

        Assert.Contains(rows, row => row.Code.McCode == expectedCode);
        if (column != "codeType")
        {
            Assert.Single(rows);
        }
    }

    [Theory]
    [InlineData("startsWith", "ben", "A01")]
    [InlineData("endsWith", "MOTOR", "A02")]
    [InlineData("contains", "toy", "A02")]
    [InlineData("equals", "Toyota Motor", "A02")]
    [InlineData("notEquals", "Toyota Motor", "A01")]
    public void All_text_operators_apply_to_adjustment_columns(string op, string value, string expectedCode)
    {
        var rows = Query(Codes(), CodeTypes(), Filters(name: new TextFilter(value, op)));

        Assert.Contains(rows, row => row.Code.McCode == expectedCode);
        if (op == "equals")
        {
            Assert.Single(rows);
        }
    }

    [Fact]
    public void Status_filters_include_null_as_active_and_not_equals_is_supported()
    {
        var activeCodes = Query(Codes(), CodeTypes(), Filters(active: new StatusFilter(true)))
            .Select(row => row.Code.McCode);
        var inactiveCodes = Query(Codes(), CodeTypes(), Filters(active: new StatusFilter(false)))
            .Select(row => row.Code.McCode);
        var notActiveCodes = Query(Codes(), CodeTypes(), Filters(active: new StatusFilter(true, "notEquals")))
            .Select(row => row.Code.McCode);

        Assert.Equal(new[] { "B01", "M01", "A01" }, activeCodes);
        Assert.Equal(new[] { "A02" }, inactiveCodes);
        Assert.Equal(new[] { "A02" }, notActiveCodes);
    }

    [Fact]
    public void Filters_combine_with_and_and_blank_filters_are_ignored()
    {
        var rows = Query(
            Codes(),
            CodeTypes(),
            Filters(codeType: new TextFilter("vehicle"), name: new TextFilter("motor")));

        Assert.Equal(new[] { "A02" }, rows.Select(row => row.Code.McCode));

        var unchanged = Query(Codes(), CodeTypes(), Filters(code: new TextFilter("  ", "equals")));
        Assert.Equal(4, unchanged.Count);
    }

    [Fact]
    public void Sorting_is_case_insensitive_and_is_applied_before_paging()
    {
        var source = new[]
        {
            Make("A", "ZT01", "C01", "BMW", "B", null),
            Make("A", "ZT02", "C01", "Bentley", "B", null),
            Make("A", "ZT03", "C01", "Aston Martin", "A", null)
        };
        var sorted = Query(source, CodeTypes(), sortBy: "name");

        Assert.Equal(new[] { "ZT03", "ZT02", "ZT01" }, sorted.Select(row => row.Code.McCode));
        Assert.Equal("ZT02", Query(source, CodeTypes(), sortBy: "name").Skip(1).Take(1).Single().Code.McCode);
    }

    [Fact]
    public void Composite_key_breaks_ties_so_pages_neither_repeat_nor_lose_rows()
    {
        var source = Enumerable.Range(1, 25)
            .Select(number => Make("A", $"ZT{number:000}", "C01", "Same", "Same", null))
            .ToArray();
        var sorted = Query(source, CodeTypes());
        var pages = Enumerable.Range(0, 3)
            .SelectMany(page => sorted.Skip(page * PremiumAdjustmentListQuery.PageSize).Take(PremiumAdjustmentListQuery.PageSize))
            .Select(row => row.Code.McCode)
            .ToArray();

        Assert.Equal(25, pages.Length);
        Assert.Equal(25, pages.Distinct().Count());
        Assert.Equal("ZT001", pages[0]);
        Assert.Equal("ZT025", pages[^1]);
    }

    [Fact]
    public void Invalid_page_operator_sort_and_direction_are_reported()
    {
        var errors = PremiumAdjustmentListQuery.Validate(
            0,
            Filters(codeType: new TextFilter("x", "regex")),
            "arbitrary",
            "sideways");

        Assert.Contains("page", errors.Keys);
        Assert.Contains("codeTypeOperator", errors.Keys);
        Assert.Contains("sortBy", errors.Keys);
        Assert.Contains("sortDirection", errors.Keys);
    }

    private static ColumnFilters FiltersFor(string column, TextFilter filter) =>
        column switch
        {
            "codeType" => Filters(codeType: filter),
            "code" => Filters(code: filter),
            "companyCode" => Filters(companyCode: filter),
            "name" => Filters(name: filter),
            "shortName" => Filters(shortName: filter),
            _ => throw new ArgumentOutOfRangeException(nameof(column))
        };
}
