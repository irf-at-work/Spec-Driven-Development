using SDD.API.Services;
using SDD.API.Contracts;

namespace SDD.API.Tests.Services;

public sealed class CompanyServiceReadTests
{
    [Theory]
    [InlineData(CompanyFilterOperator.StartsWith, "AL", "A01")]
    [InlineData(CompanyFilterOperator.EndsWith, "PHA", "A01")]
    [InlineData(CompanyFilterOperator.Contains, "LP", "A01")]
    [InlineData(CompanyFilterOperator.DoesNotContain, "BET", "A01")]
    [InlineData(CompanyFilterOperator.Equals, "alpha", "A01")]
    [InlineData(CompanyFilterOperator.NotEquals, "ALPHA", "A02")]
    public async Task Applies_case_insensitive_text_operator_before_paging(
        CompanyFilterOperator operation,
        string value,
        string expectedCompanyCode)
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "A01", CompName = "Alpha" },
            new() { CompCode = "A02", CompName = "Beta" },
        ]);
        var service = new CompanyService(repository);

        var result = await service.ListAsync(new CompanyListQuery
        {
            CompanyName = $"  {value}  ",
            CompanyNameOperator = operation,
            PageSize = 1,
        }, CancellationToken.None);

        Assert.Equal(expectedCompanyCode, Assert.Single(result.Items).CompanyCode);
        Assert.Equal(1, result.TotalCount);
    }

    [Fact]
    public async Task Ignores_blank_terms_and_null_values_for_negative_operators()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "A01", CompName = "Alpha" },
            new() { CompCode = "A02", CompName = "Beta" },
            new() { CompCode = "A03", CompName = null! },
        ]);
        var service = new CompanyService(repository);

        var noFilter = await service.ListAsync(new CompanyListQuery
        {
            CompanyName = "   ",
            CompanyNameOperator = CompanyFilterOperator.Equals,
        }, CancellationToken.None);
        var notEqual = await service.ListAsync(new CompanyListQuery
        {
            CompanyName = "Alpha",
            CompanyNameOperator = CompanyFilterOperator.NotEquals,
        }, CancellationToken.None);

        Assert.Equal(3, noFilter.TotalCount);
        Assert.Equal(["A02"], notEqual.Items.Select(company => company.CompanyCode));
    }

    [Theory]
    [InlineData(CompanyFilterOperator.StartsWith, "harbour, tower", "A01")]
    [InlineData(CompanyFilterOperator.Contains, "harbour, tower", "A01")]
    [InlineData(CompanyFilterOperator.Equals, "Harbour, Tower", "A01")]
    public async Task Filters_composed_primary_address(
        CompanyFilterOperator operation,
        string value,
        string expectedCompanyCode)
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "A01", CompName = "One", CompAddr1 = " Harbour ", CompAddr3 = "Tower" },
            new() { CompCode = "A02", CompName = "Two", CompAddr1 = "Harbour", CompAddr2 = "View" },
        ]);
        var service = new CompanyService(repository);

        var result = await service.ListAsync(new CompanyListQuery
        {
            PrimaryAddress = value,
            PrimaryAddressOperator = operation,
        }, CancellationToken.None);

        Assert.Equal(expectedCompanyCode, Assert.Single(result.Items).CompanyCode);
    }

    [Fact]
    public async Task Lists_companies_with_filters_stable_sorting_and_composed_addresses()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "C03", CompName = "North", CompShortName = "North", CompAddr1 = "Bay", CompAddr3 = "Tower" },
            new() { CompCode = "C02", CompName = "North", CompShortName = "North", CompAddr2 = "Harbour" },
            new() { CompCode = "C01", CompName = "South", CompShortName = "South" },
        ]);
        var service = new CompanyService(repository);

        var result = await service.ListAsync(new CompanyListQuery
        {
            CompanyName = "north",
            SortBy = "companyName",
            SortDirection = "asc",
        }, CancellationToken.None);

        Assert.Equal(2, result.TotalCount);
        Assert.Equal(["C02", "C03"], result.Items.Select(company => company.CompanyCode));
        Assert.Equal("Bay, Tower", result.Items[1].PrimaryAddress);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
    }

    [Fact]
    public async Task Filters_primary_address_and_date_fields_before_paging()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "A01", CompName = "One", CompAddr1 = "Harbour", CompIncorpDt = new DateTime(2020, 3, 5, 15, 0, 0) },
            new() { CompCode = "A02", CompName = "Two", CompAddr2 = "Harbour View", CompIncorpDt = new DateTime(2020, 3, 6) },
        ]);
        var service = new CompanyService(repository);

        var result = await service.ListAsync(new CompanyListQuery
        {
            PrimaryAddress = "harbour",
            IncorporationDate = new DateOnly(2020, 3, 5),
            Page = 2,
            PageSize = 1,
        }, CancellationToken.None);

        Assert.Equal(1, result.TotalCount);
        Assert.Empty(result.Items);
        Assert.Equal(2, result.Page);
    }

    [Fact]
    public async Task Returns_empty_out_of_range_page_and_rejects_invalid_sort_fields()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.Add(new() { CompCode = "A01", CompName = "Company" });
        var service = new CompanyService(repository);

        var page = await service.ListAsync(new CompanyListQuery
        {
            Page = 3,
            PageSize = 1,
        }, CancellationToken.None);
        var exception = await Assert.ThrowsAsync<CompanyValidationException>(
            () => service.ListAsync(new CompanyListQuery { SortBy = "action" }, CancellationToken.None));

        Assert.Empty(page.Items);
        Assert.Equal(1, page.TotalCount);
        Assert.Contains("sortBy", exception.Errors.Keys);
    }

    [Fact]
    public async Task Returns_company_details_without_exposing_other_storage_fields()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.Add(new()
        {
            CompCode = "A01",
            CompName = "Company",
            CompAddr1 = "First",
            CompAddr2 = " ",
            CompAddr3 = "Third",
            CompCrBy = "Admin",
            CompCrDt = new DateTime(2026, 1, 2, 3, 4, 5, DateTimeKind.Utc),
            CompRemarks = "private storage field",
        });
        var service = new CompanyService(repository);

        var result = await service.GetAsync("A01", CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("First, Third", result.PrimaryAddress);
        Assert.Equal("Admin", result.CreatedBy);
        Assert.Equal(DateTimeKind.Utc, result.CreatedAt!.Value.Kind);
        Assert.DoesNotContain("private storage field", System.Text.Json.JsonSerializer.Serialize(result));
    }
}
