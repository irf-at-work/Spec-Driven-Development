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
    public async Task List_applies_all_filters_before_counting_and_paging()
    {
        var filters = new[]
        {
            new CodeColumnFilter(CodeFilterColumn.Code, CodeFilterOperator.Contains, "usd"),
            new CodeColumnFilter(CodeFilterColumn.CodeType, CodeFilterOperator.EqualTo, "CURRENCY"),
        };
        var listedRecord = new STD_CODES
        {
            CC_CODE = "USD",
            CC_TYPE = "CURRENCY",
            CC_COMP_CODE = "USD",
        };
        var repository = new FakeCodesRepository
        {
            TotalCount = 1,
            ListedRecords = [listedRecord],
        };
        var service = CreateService(repository);

        var result = await service.ListAsync(
            2,
            10,
            filters,
            CodeSortColumn.CodeDescription,
            CodeSortDirection.Descending,
            default);

        Assert.Equal(filters, repository.CountFilters);
        Assert.Equal(filters, repository.PageFilters);
        Assert.Equal(CodeSortColumn.CodeDescription, repository.RequestedSortBy);
        Assert.Equal(CodeSortDirection.Descending, repository.RequestedSortDirection);
        Assert.Equal(10, repository.RequestedSkip);
        Assert.Equal(10, repository.RequestedPageSize);
        Assert.Equal(1, result.TotalCount);
        Assert.Equal("USD", Assert.Single(result.Items).Code);
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
        var systemDate = new DateTime(2025, 1, 15, 9, 30, 0);
        var repository = new FakeCodesRepository { SystemDate = systemDate };
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
        Assert.Equal(systemDate, repository.AddedRecord.CC_CR_DT);
        Assert.Null(repository.AddedRecord.CC_UP_BY);
        Assert.Null(repository.AddedRecord.CC_UP_DT);
        Assert.Equal("SHARED", response.Code);
        Assert.Equal("ADMIN", response.CreatedBy);
        Assert.Equal(systemDate, response.CreatedDate);
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
    public async Task Update_preserves_creation_audit_and_sets_update_audit_from_system_date()
    {
        var createdDate = new DateTime(2025, 1, 15, 9, 30, 0);
        var systemDate = new DateTime(2025, 2, 20, 10, 15, 0);
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
        var repository = new FakeCodesRepository { Record = record, SystemDate = systemDate };
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
        Assert.Equal("ADMIN", record.CC_UP_BY);
        Assert.Equal(systemDate, record.CC_UP_DT);
        Assert.Equal("ADMIN", response!.UpdatedBy);
        Assert.Equal(systemDate, response.UpdatedDate);
        Assert.Equal("ORIGINAL", response.CreatedBy);
        Assert.Equal(createdDate, response.CreatedDate);
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
        public DateTime SystemDate { get; init; } = new(2025, 1, 1);
        public Func<string, string, bool> Exists { get; init; } = (_, _) => false;
        public Exception? SaveException { get; init; }
        public int TotalCount { get; init; }
        public IReadOnlyList<STD_CODES> ListedRecords { get; init; } = [];
        public bool AddCalled { get; private set; }
        public STD_CODES? AddedRecord { get; private set; }
        public STD_CODES? RemovedRecord { get; private set; }
        public (string Code, string CodeType)? FindKey { get; private set; }
        public IReadOnlyList<CodeColumnFilter>? CountFilters { get; private set; }
        public IReadOnlyList<CodeColumnFilter>? PageFilters { get; private set; }
        public int RequestedSkip { get; private set; }
        public int RequestedPageSize { get; private set; }
        public CodeSortColumn RequestedSortBy { get; private set; }
        public CodeSortDirection RequestedSortDirection { get; private set; }

        public Task<int> CountAsync(
            IReadOnlyList<CodeColumnFilter> filters,
            CancellationToken cancellationToken)
        {
            CountFilters = filters;
            return Task.FromResult(TotalCount);
        }

        public Task<IReadOnlyList<STD_CODES>> GetPageAsync(
            int skip,
            int pageSize,
            IReadOnlyList<CodeColumnFilter> filters,
            CodeSortColumn sortBy,
            CodeSortDirection sortDirection,
            CancellationToken cancellationToken)
        {
            RequestedSkip = skip;
            RequestedPageSize = pageSize;
            RequestedSortBy = sortBy;
            RequestedSortDirection = sortDirection;
            PageFilters = filters;
            return Task.FromResult(ListedRecords);
        }

        public Task<STD_CODES?> FindAsync(
            string code,
            string codeType,
            CancellationToken cancellationToken)
        {
            FindKey = (code, codeType);
            return Task.FromResult(Record);
        }

        public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
            Task.FromResult(SystemDate);

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
