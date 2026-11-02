using Microsoft.AspNetCore.Http.HttpResults;
using SDD.API.Common;
using SDD.API.Contracts;
using SDD.API.Controllers;
using SDD.API.Services;
using SDD.API.Tests.Services;

namespace SDD.API.Tests.Controllers;

public sealed class CompanyControllerTests
{
    [Fact]
    public async Task List_maps_text_operator_parameters_to_the_company_query()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.AddRange(
        [
            new() { CompCode = "A01", CompName = "North Mutual" },
            new() { CompCode = "A02", CompName = "South North" },
        ]);
        var controller = new CompanyController(new CompanyService(repository));

        var result = await controller.List(
            companyName: "North",
            companyNameOperator: CompanyFilterOperator.StartsWith,
            cancellationToken: CancellationToken.None);

        var ok = Assert.IsType<Ok<PaginatedResult<CompanyListItemDto>>>(result.Result);
        Assert.Equal(["A01"], ok.Value!.Items.Select(company => company.CompanyCode));
    }
}
