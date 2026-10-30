using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Controllers;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class CodesControllerUpdateTests
{
    [Fact]
    public async Task Update_uses_both_key_values_and_returns_the_updated_record()
    {
        var record = new CodeRecordResponse { Code = "EDIT", CodeType = "TYPE", CompanyCode = "EDIT" };
        var service = new UpdateCodesServiceStub { UpdatedRecord = record };
        var controller = new CodesController(service);

        var result = await controller.Update(
            "EDIT",
            "TYPE",
            new CodeWriteRequest { Code = "EDIT", CodeType = "TYPE" });

        var response = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(record, response.Value);
        Assert.Equal(("EDIT", "TYPE"), service.RequestedKey);
    }

    [Fact]
    public async Task Update_does_not_report_a_missing_record_as_success()
    {
        var controller = new CodesController(new UpdateCodesServiceStub());

        var exception = await Assert.ThrowsAsync<CodesApiException>(
            () => controller.Update(
                "MISSING",
                "TYPE",
                new CodeWriteRequest { Code = "MISSING", CodeType = "TYPE" }));

        Assert.Equal(StatusCodes.Status404NotFound, exception.StatusCode);
    }

    private sealed class UpdateCodesServiceStub : ICodesService
    {
        public CodeRecordResponse? UpdatedRecord { get; init; }
        public (string Code, string CodeType)? RequestedKey { get; private set; }

        public Task<PaginatedResult<CodeRecordResponse>> ListAsync(int page, int pageSize, CancellationToken cancellationToken) =>
            Task.FromResult(new PaginatedResult<CodeRecordResponse>([], page, pageSize, 0));

        public Task<CodeRecordResponse?> GetAsync(string code, string codeType, CancellationToken cancellationToken) =>
            Task.FromResult<CodeRecordResponse?>(null);

        public Task<CodeRecordResponse> CreateAsync(CodeWriteRequest request, CancellationToken cancellationToken) =>
            throw new NotImplementedException();

        public Task<CodeRecordResponse?> UpdateAsync(
            string code,
            string codeType,
            CodeWriteRequest request,
            CancellationToken cancellationToken)
        {
            RequestedKey = (code, codeType);
            return Task.FromResult(UpdatedRecord);
        }

        public Task<bool> DeleteAsync(string code, string codeType, CancellationToken cancellationToken) =>
            Task.FromResult(false);
    }
}
