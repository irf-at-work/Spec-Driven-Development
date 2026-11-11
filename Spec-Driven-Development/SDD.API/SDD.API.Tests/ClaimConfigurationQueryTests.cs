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
            new ClaimConfigurationListRow { CcmCompCode = "CCM001", CcmCode = "CCM-A", CcmName = "Health Claims", CcmShortName = "HLT", ModuleName = "Medical" },
            new ClaimConfigurationListRow { CcmCompCode = "ASRTEST", CcmCode = "CCM-B", CcmName = "Health Claims", CcmShortName = "HLT", ModuleName = "Finance" },
            new ClaimConfigurationListRow { CcmCompCode = "CCM001", CcmCode = "CCM-C", CcmName = "Auto Claims", CcmShortName = "AUT", ModuleName = "Medical" }
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
    public void ApplyFilters_can_select_company_code_case_insensitively()
    {
        var rows = new[]
        {
            new ClaimConfigurationListRow { CcmCompCode = "CCM001", CcmCode = "CCM-A", CcmName = "A" },
            new ClaimConfigurationListRow { CcmCompCode = "ASRTEST", CcmCode = "CCM-B", CcmName = "B" }
        }.AsQueryable();

        var result = ClaimConfigurationQuery.ApplyFilters(
            rows,
            [new ClaimConfigurationFilter(
                ClaimConfigurationFilterColumn.CompanyCode,
                CodeFilterOperator.EqualTo,
                "asrtest")]).ToArray();

        Assert.Collection(result, row =>
        {
            Assert.Equal("ASRTEST", row.CcmCompCode);
            Assert.Equal("CCM-B", row.CcmCode);
        });
    }

    [Fact]
    public void Create_projects_module_description_from_the_module_lookup_type()
    {
        var createdDate = new DateTime(2026, 11, 11, 9, 0, 0, DateTimeKind.Unspecified);
        var updatedDate = createdDate.AddHours(1);
        var records = new[]
        {
            new BRM_CLM_CONFIG
            {
                CCM_COMP_CODE = "ASRTEST",
                CCM_CODE = "CCM-A",
                CCM_NAME = "A",
                CCM_MODULE = "01",
                CCM_CR_BY = "CREATOR",
                CCM_CR_DT = createdDate,
                CCM_UP_BY = "UPDATER",
                CCM_UP_DT = updatedDate
            }
        }.AsQueryable();
        var lookups = new[]
        {
            new STD_LIST_ITEM { LI_TYPE = "OTHER", LI_CODE = "01", LI_DESC = "Wrong" },
            new STD_LIST_ITEM { LI_TYPE = "CCM_MODULE", LI_CODE = "01", LI_DESC = "Claims" }
        }.AsQueryable();

        var row = Assert.Single(ClaimConfigurationQuery.Create(records, lookups));

        Assert.Equal("ASRTEST", row.CcmCompCode);
        Assert.Equal("Claims", row.ModuleName);
        Assert.Equal("CREATOR", row.CreatedBy);
        Assert.Equal(createdDate, row.CreatedDate);
        Assert.Equal("UPDATER", row.UpdatedBy);
        Assert.Equal(updatedDate, row.UpdatedDate);
    }

    [Fact]
    public void ApplySort_uses_code_as_a_stable_tie_breaker()
    {
        var rows = new[]
        {
            new ClaimConfigurationListRow { CcmCompCode = "ASRTEST", CcmCode = "CCM-B", CcmName = "Same" },
            new ClaimConfigurationListRow { CcmCompCode = "CCM001", CcmCode = "CCM-A", CcmName = "Same" }
        }.AsQueryable();

        var result = ClaimConfigurationQuery.ApplySort(
            rows,
            ClaimConfigurationSortColumn.Name,
            CodeSortDirection.Ascending).ToArray();

        Assert.Equal(new[] { "CCM-A", "CCM-B" }, result.Select(row => row.CcmCode));
    }
}
