using SDD.API.Contracts;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class ClaimConfigurationQueryTests
{
    [Fact]
    public void ApplyFilters_combines_filters_case_insensitively()
    {
        var rows = new[]
        {
            new ClaimConfigurationListRow { CcmCode = "CCM-A", CcmName = "Health Claims", CcmShortName = "HLT", ModuleName = "Medical" },
            new ClaimConfigurationListRow { CcmCode = "CCM-B", CcmName = "Health Claims", CcmShortName = "HLT", ModuleName = "Finance" },
            new ClaimConfigurationListRow { CcmCode = "CCM-C", CcmName = "Auto Claims", CcmShortName = "AUT", ModuleName = "Medical" }
        }.AsQueryable();
        var filters = new[]
        {
            new ClaimConfigurationFilter(ClaimConfigurationFilterColumn.CcmName, CodeFilterOperator.Contains, "health"),
            new ClaimConfigurationFilter(ClaimConfigurationFilterColumn.ModuleName, CodeFilterOperator.EqualTo, "medical")
        };

        var result = ClaimConfigurationQuery.ApplyFilters(rows, filters).ToArray();

        Assert.Collection(result, row => Assert.Equal("CCM-A", row.CcmCode));
    }

    [Fact]
    public void Create_projects_module_description_from_the_module_lookup_type()
    {
        var records = new[]
        {
            new BRM_CLM_CONFIG { CCM_CODE = "CCM-A", CCM_NAME = "A", CCM_MODULE = "01" }
        }.AsQueryable();
        var lookups = new[]
        {
            new STD_LIST_ITEM { LI_TYPE = "OTHER", LI_CODE = "01", LI_DESC = "Wrong" },
            new STD_LIST_ITEM { LI_TYPE = "CCM_MODULE", LI_CODE = "01", LI_DESC = "Claims" }
        }.AsQueryable();

        var row = Assert.Single(ClaimConfigurationQuery.Create(records, lookups));

        Assert.Equal("Claims", row.ModuleName);
    }

    [Fact]
    public void ApplySort_uses_code_as_a_stable_tie_breaker()
    {
        var rows = new[]
        {
            new ClaimConfigurationListRow { CcmCode = "CCM-B", CcmName = "Same" },
            new ClaimConfigurationListRow { CcmCode = "CCM-A", CcmName = "Same" }
        }.AsQueryable();

        var result = ClaimConfigurationQuery.ApplySort(
            rows,
            ClaimConfigurationSortColumn.Name,
            CodeSortDirection.Ascending).ToArray();

        Assert.Equal(new[] { "CCM-A", "CCM-B" }, result.Select(row => row.CcmCode));
    }
}
