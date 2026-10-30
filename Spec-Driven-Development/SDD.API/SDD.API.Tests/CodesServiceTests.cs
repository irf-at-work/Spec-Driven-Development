using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Contracts;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class CodesServiceTests
{
    [Fact]
    public void Validator_checks_required_values_and_oracle_byte_limits()
    {
        var validator = new CodesFieldValidator();

        var requiredErrors = validator.Validate(new CodeWriteRequest());
        Assert.Contains("code", requiredErrors.Keys);
        Assert.Contains("codeType", requiredErrors.Keys);

        var validArabicBoundary = validator.Validate(new CodeWriteRequest
        {
            Code = new string('ش', 12),
            CodeType = "TYPE",
            DescriptionInArabic = new string('ش', 100),
        });
        Assert.Empty(validArabicBoundary);

        var overLimit = validator.Validate(new CodeWriteRequest
        {
            Code = new string('ش', 13),
            CodeType = "TYPE",
            ActiveYn = "YY",
        });
        Assert.Contains("code", overLimit.Keys);
        Assert.Contains("activeYn", overLimit.Keys);
    }

    [Fact]
    public async Task Create_rejects_duplicate_composite_key_without_adding_a_record()
    {
        var repository = new FakeCodesRepository
        {
            Exists = (code, codeType) =>
                (code == "DUP" && codeType == "TYPE") ||
                (code == "SHARED" && codeType == "GENERAL"),
        };
        var service = CreateService(repository);

        var exception = await Assert.ThrowsAsync<CodesApiException>(
            () => service.CreateAsync(new CodeWriteRequest { Code = "DUP", CodeType = "TYPE" }, default));

        Assert.Equal(409, exception.StatusCode);
        Assert.False(repository.AddCalled);
    }

    [Fact]
    public async Task Create_uses_composite_key_and_sets_server_controlled_values()
    {
        var repository = new FakeCodesRepository();
        var service = CreateService(repository);

        var response = await service.CreateAsync(
            new CodeWriteRequest
            {
                Code = "SHARED",
                CodeType = "OTHER",
                CodeDescription = "A second type",
            },
            default);

        Assert.True(repository.AddCalled);
        Assert.Equal("SHARED", repository.AddedRecord!.CC_CODE);
        Assert.Equal("OTHER", repository.AddedRecord.CC_TYPE);
        Assert.Equal("SHARED", repository.AddedRecord.CC_COMP_CODE);
        Assert.Equal("ADMIN", repository.AddedRecord.CC_CR_BY);
        Assert.Null(repository.AddedRecord.CC_CR_DT);
        Assert.Null(repository.AddedRecord.CC_UP_BY);
        Assert.Null(repository.AddedRecord.CC_UP_DT);
        Assert.Equal("SHARED", response.Code);
    }

    [Fact]
    public async Task Create_does_not_return_success_when_persistence_fails()
    {
        var repository = new FakeCodesRepository
        {
            SaveException = new InvalidOperationException("database failure"),
        };
        var service = CreateService(repository);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CreateAsync(new CodeWriteRequest { Code = "NEW", CodeType = "TYPE" }, default));
    }

    [Fact]
    public async Task Update_preserves_creation_audit_and_keeps_update_audit_null()
    {
        var createdDate = new DateTime(2025, 1, 15, 9, 30, 0);
        var record = new STD_CODES
        {
            CC_CODE = "EDIT",
            CC_TYPE = "TYPE",
            CC_COMP_CODE = "EDIT",
            CC_CR_BY = "ORIGINAL",
            CC_CR_DT = createdDate,
            CC_UP_BY = "OLD",
            CC_UP_DT = createdDate,
        };
        var repository = new FakeCodesRepository { Record = record };
        var service = CreateService(repository);

        var response = await service.UpdateAsync(
            "EDIT",
            "TYPE",
            new CodeWriteRequest { Code = "EDIT", CodeType = "TYPE", CodeDescription = "Updated" },
            default);

        Assert.NotNull(response);
        Assert.Equal("Updated", record.CC_DESC);
        Assert.Equal("ORIGINAL", record.CC_CR_BY);
        Assert.Equal(createdDate, record.CC_CR_DT);
        Assert.Null(record.CC_UP_BY);
        Assert.Null(record.CC_UP_DT);
    }

    [Fact]
    public async Task Update_rejects_a_changed_composite_identity()
    {
        var service = CreateService(new FakeCodesRepository());

        var exception = await Assert.ThrowsAsync<CodesApiException>(
            () => service.UpdateAsync(
                "CODE",
                "TYPE",
                new CodeWriteRequest { Code = "CODE", CodeType = "OTHER" },
                default));

        Assert.Equal(400, exception.StatusCode);
    }

    [Fact]
    public async Task Delete_uses_both_composite_key_values()
    {
        var record = new STD_CODES { CC_CODE = "CODE", CC_TYPE = "TYPE" };
        var repository = new FakeCodesRepository { Record = record };
        var service = CreateService(repository);

        var deleted = await service.DeleteAsync("CODE", "TYPE", default);

        Assert.True(deleted);
        Assert.Equal(("CODE", "TYPE"), repository.FindKey);
        Assert.Same(record, repository.RemovedRecord);
    }

    private static CodesService CreateService(FakeCodesRepository repository) =>
        new(repository, new CodesFieldValidator(), NullLogger<CodesService>.Instance);

    private sealed class FakeCodesRepository : ICodesRepository
    {
        public STD_CODES? Record { get; init; }
        public Func<string, string, bool> Exists { get; init; } = (_, _) => false;
        public Exception? SaveException { get; init; }
        public bool AddCalled { get; private set; }
        public STD_CODES? AddedRecord { get; private set; }
        public STD_CODES? RemovedRecord { get; private set; }
        public (string Code, string CodeType)? FindKey { get; private set; }

        public Task<int> CountAsync(CancellationToken cancellationToken) => Task.FromResult(0);

        public Task<IReadOnlyList<STD_CODES>> GetPageAsync(
            int skip,
            int pageSize,
            CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<STD_CODES>>([]);

        public Task<STD_CODES?> FindAsync(
            string code,
            string codeType,
            CancellationToken cancellationToken)
        {
            FindKey = (code, codeType);
            return Task.FromResult(Record);
        }

        public Task<bool> ExistsAsync(
            string code,
            string codeType,
            CancellationToken cancellationToken) =>
            Task.FromResult(Exists(code, codeType));

        public Task AddAsync(STD_CODES record, CancellationToken cancellationToken)
        {
            AddCalled = true;
            AddedRecord = record;
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken) =>
            SaveException is null ? Task.CompletedTask : Task.FromException(SaveException);

        public void Remove(STD_CODES record) => RemovedRecord = record;
    }
}
