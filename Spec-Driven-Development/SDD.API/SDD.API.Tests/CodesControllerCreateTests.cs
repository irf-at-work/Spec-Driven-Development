using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Controllers;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class CodesControllerCreateTests
{
    [Fact]
    public async Task Create_returns_the_created_record_and_composite_location()
    {
        var expected = new CodeRecordResponse { Code = "NEW", CodeType = "TYPE", CompanyCode = "NEW" };
        var service = new CreateCodesServiceStub { CreatedRecord = expected };
        var controller = new CodesController(service);

        var result = await controller.Create(
            new CodeWriteRequest { Code = "NEW", CodeType = "TYPE" });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(CodesController.Get), created.ActionName);
        Assert.Equal("NEW", created.RouteValues!["code"]);
        Assert.Equal("TYPE", created.RouteValues["codeType"]);
        Assert.Same(expected, created.Value);
    }

    [Fact]
    public async Task Create_propagates_a_safe_duplicate_error()
    {
        var service = new CreateCodesServiceStub
        {
            Create = (_, _) => throw new CodesApiException(
                409,
                "This code already exists.",
                "A record with the same Code and Code Type already exists."),
        };
        var controller = new CodesController(service);

        var exception = await Assert.ThrowsAsync<CodesApiException>(
            () => controller.Create(new CodeWriteRequest { Code = "DUP", CodeType = "TYPE" }));

        Assert.Equal(409, exception.StatusCode);
        Assert.DoesNotContain("database", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    private sealed class CreateCodesServiceStub : ICodesService
    {
        public CodeRecordResponse CreatedRecord { get; init; } = new()
        {
            Code = string.Empty,
            CodeType = string.Empty,
            CompanyCode = string.Empty,
        };
        public Func<CodeWriteRequest, CancellationToken, Task<CodeRecordResponse>>? Create { get; init; }

        public Task<PaginatedResult<CodeRecordResponse>> ListAsync(
            int page,
            int pageSize,
            IReadOnlyList<CodeColumnFilter> filters,
            CodeSortColumn sortBy,
            CodeSortDirection sortDirection,
            CancellationToken cancellationToken) =>
            Task.FromResult(new PaginatedResult<CodeRecordResponse>([], page, pageSize, 0));

        public Task<CodeRecordResponse?> GetAsync(string code, string codeType, CancellationToken cancellationToken) =>
            Task.FromResult<CodeRecordResponse?>(null);

        public Task<CodeRecordResponse> CreateAsync(CodeWriteRequest request, CancellationToken cancellationToken) =>
            Create is null
                ? Task.FromResult(CreatedRecord)
                : Create(request, cancellationToken);

        public Task<CodeRecordResponse?> UpdateAsync(string code, string codeType, CodeWriteRequest request, CancellationToken cancellationToken) =>
            Task.FromResult<CodeRecordResponse?>(null);

        public Task<bool> DeleteAsync(string code, string codeType, CancellationToken cancellationToken) =>
            Task.FromResult(false);
    }
}
