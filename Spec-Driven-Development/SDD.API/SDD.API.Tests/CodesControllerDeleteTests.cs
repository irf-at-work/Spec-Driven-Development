using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Controllers;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class CodesControllerDeleteTests
{
    [Fact]
    public async Task Delete_requires_both_composite_key_values()
    {
        var service = new DeleteCodesServiceStub { DeleteResult = true };
        var controller = new CodesController(service);

        var result = await controller.Delete("CODE", "TYPE");

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(("CODE", "TYPE"), service.RequestedKey);
    }

    [Fact]
    public async Task Delete_does_not_return_success_for_a_missing_record()
    {
        var controller = new CodesController(new DeleteCodesServiceStub());

        var exception = await Assert.ThrowsAsync<CodesApiException>(
            () => controller.Delete("MISSING", "TYPE"));

        Assert.Equal(StatusCodes.Status404NotFound, exception.StatusCode);
    }

    [Fact]
    public async Task Delete_propagates_constraint_conflicts_without_a_success_response()
    {
        var service = new DeleteCodesServiceStub
        {
            Delete = (_, _, _) => throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The code could not be deleted.",
                "Another record depends on this code. Refresh the listing and try again."),
        };
        var controller = new CodesController(service);

        var exception = await Assert.ThrowsAsync<CodesApiException>(
            () => controller.Delete("CODE", "TYPE"));

        Assert.Equal(StatusCodes.Status409Conflict, exception.StatusCode);
    }

    private sealed class DeleteCodesServiceStub : ICodesService
    {
        public bool DeleteResult { get; init; }
        public Func<string, string, CancellationToken, Task<bool>>? Delete { get; init; }
        public (string Code, string CodeType)? RequestedKey { get; private set; }

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
            throw new NotImplementedException();

        public Task<CodeRecordResponse?> UpdateAsync(
            string code,
            string codeType,
            CodeWriteRequest request,
            CancellationToken cancellationToken) =>
            Task.FromResult<CodeRecordResponse?>(null);

        public Task<bool> DeleteAsync(string code, string codeType, CancellationToken cancellationToken)
        {
            RequestedKey = (code, codeType);
            return Delete is null
                ? Task.FromResult(DeleteResult)
                : Delete(code, codeType, cancellationToken);
        }
    }
}
