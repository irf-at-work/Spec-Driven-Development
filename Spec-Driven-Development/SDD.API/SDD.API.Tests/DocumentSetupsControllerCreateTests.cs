using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Contracts;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class DocumentSetupsControllerCreateTests
{
    [Fact]
    public void Validator_requires_doc_code_and_setup_for()
    {
        var errors = new DocumentSetupValidator().Validate(new DocumentSetupWriteRequest());

        Assert.Contains("docCode", errors.Keys);
        Assert.Contains("docSetupFor", errors.Keys);
    }

    [Fact]
    public void Validator_accepts_optional_name_and_description_and_exact_byte_boundaries()
    {
        var errors = new DocumentSetupValidator().Validate(new DocumentSetupWriteRequest
        {
            DocCode = new string('ش', 12),
            DocSetupFor = "101",
            DocName = new string('ش', 100),
            NameInArabic = new string('ش', 100),
            DocDescription = new string('ش', 2000),
            DescriptionInArabic = new string('ش', 2000),
            Flex1 = new string('ش', 60),
            Flex2 = new string('ش', 60),
            ActiveYn = "Y",
        });

        Assert.Empty(errors);
    }

    [Fact]
    public void Validator_rejects_fields_that_exceed_the_Oracle_byte_limits()
    {
        var errors = new DocumentSetupValidator().Validate(new DocumentSetupWriteRequest
        {
            DocCode = new string('ش', 13),
            DocSetupFor = "101",
            DocName = new string('ش', 101),
            DocDescription = new string('ش', 2001),
            Flex1 = new string('ش', 61),
            ActiveYn = "YY",
        });

        Assert.Contains("docCode", errors.Keys);
        Assert.Contains("docName", errors.Keys);
        Assert.Contains("docDescription", errors.Keys);
        Assert.Contains("flex1", errors.Keys);
        Assert.Contains("activeYn", errors.Keys);
    }

    [Fact]
    public void Validator_allows_dynamic_setup_codes_and_rejects_invalid_active_values()
    {
        var errors = new DocumentSetupValidator().Validate(new DocumentSetupWriteRequest
        {
            DocCode = "DOC-1",
            DocSetupFor = "103",
            ActiveYn = "X",
        });

        Assert.DoesNotContain("docSetupFor", errors.Keys);
        Assert.Contains("activeYn", errors.Keys);
    }

    [Theory]
    [InlineData("101")]
    [InlineData("102")]
    [InlineData("103")]
    public async Task Create_persists_setup_codes_from_codes_master_and_server_audit_values(string setupFor)
    {
        var systemDate = new DateTime(2026, 11, 2, 9, 30, 0);
        var repository = new FakeDocumentSetupsRepository { SystemDate = systemDate };
        var service = CreateService(repository);

        var record = await service.CreateAsync(
            new DocumentSetupWriteRequest
            {
                DocCode = "DOC-NEW",
                DocName = "Document",
                DocSetupFor = setupFor,
            },
            default);

        Assert.Equal("DOC-NEW", repository.AddedDocument!.DOC_CODE);
        Assert.Equal(setupFor, repository.AddedDocument.DOC_SETUP_FOR);
        Assert.Equal("Y", repository.AddedDocument.DOC_ACTIVE_YN);
        Assert.Equal("ADMIN", repository.AddedDocument.DOC_CR_BY);
        Assert.Equal(systemDate, repository.AddedDocument.DOC_CR_DT);
        Assert.Null(repository.AddedDocument.DOC_UP_BY);
        Assert.Null(repository.AddedDocument.DOC_UP_DT);
        Assert.Equal(systemDate, record.CreatedDate);
        Assert.Equal("ADMIN", record.CreatedBy);
    }

    [Fact]
    public async Task Create_rejects_setup_code_missing_from_doc_setup_for_codes()
    {
        var repository = new FakeDocumentSetupsRepository { SetupForCodeExists = false };
        var service = CreateService(repository);

        var exception = await Assert.ThrowsAsync<CodesApiException>(() => service.CreateAsync(
            new DocumentSetupWriteRequest { DocCode = "DOC-NEW", DocSetupFor = "103" },
            default));

        Assert.Equal(400, exception.StatusCode);
        Assert.Contains("docSetupFor", exception.Errors!.Keys);
        Assert.False(repository.AddCalled);
    }

    [Fact]
    public async Task Create_rejects_duplicate_doc_code_without_adding_a_record()
    {
        var repository = new FakeDocumentSetupsRepository { ExistingDocument = true };
        var service = CreateService(repository);

        var exception = await Assert.ThrowsAsync<CodesApiException>(() => service.CreateAsync(
            new DocumentSetupWriteRequest { DocCode = "DUP", DocSetupFor = "101" },
            default));

        Assert.Equal(409, exception.StatusCode);
        Assert.False(repository.AddCalled);
    }

    [Fact]
    public async Task Create_does_not_report_success_when_persistence_fails()
    {
        var repository = new FakeDocumentSetupsRepository
        {
            SaveException = new InvalidOperationException("database failure"),
        };
        var service = CreateService(repository);

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(
            new DocumentSetupWriteRequest { DocCode = "DOC-NEW", DocSetupFor = "102" },
            default));
    }

    private static DocumentSetupsService CreateService(FakeDocumentSetupsRepository repository) =>
        new(repository, new DocumentSetupValidator(), NullLogger<DocumentSetupsService>.Instance);

    private sealed class FakeDocumentSetupsRepository : IDocumentSetupsRepository
    {
        public bool ExistingDocument { get; init; }
        public bool SetupForCodeExists { get; init; } = true;
        public DateTime SystemDate { get; init; } = new(2026, 11, 2);
        public Exception? SaveException { get; init; }
        public STD_DOCUMENT? AddedDocument { get; private set; }
        public bool AddCalled { get; private set; }

        public Task<int> CountAsync(
            IReadOnlyList<DocumentSetupFilter> filters,
            CancellationToken cancellationToken) =>
            Task.FromResult(0);

        public Task<IReadOnlyList<STD_DOCUMENT>> GetPageAsync(
            int skip,
            int pageSize,
            IReadOnlyList<DocumentSetupFilter> filters,
            DocumentSetupSortColumn sortBy,
            CodeSortDirection sortDirection,
            CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<STD_DOCUMENT>>([]);

        public Task<bool> ExistsAsync(string docCode, CancellationToken cancellationToken) =>
            Task.FromResult(ExistingDocument);

        public Task<bool> SetupForCodeExistsAsync(string setupForCode, CancellationToken cancellationToken) =>
            Task.FromResult(SetupForCodeExists);

        public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
            Task.FromResult(SystemDate);

        public Task AddAsync(STD_DOCUMENT document, CancellationToken cancellationToken)
        {
            AddCalled = true;
            AddedDocument = document;
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken) =>
            SaveException is null ? Task.CompletedTask : Task.FromException(SaveException);

        public Task<STD_DOCUMENT?> FindAsync(string docCode, CancellationToken cancellationToken) =>
            Task.FromResult<STD_DOCUMENT?>(null);

        public Task<STD_DOCUMENT?> UpdateIfCurrentAsync(
            string docCode,
            string expectedVersion,
            Func<STD_DOCUMENT, CancellationToken, Task> update,
            CancellationToken cancellationToken) =>
            Task.FromResult<STD_DOCUMENT?>(null);

        public Task<bool> DeleteIfCurrentAndChildFreeAsync(
            string docCode,
            string expectedVersion,
            CancellationToken cancellationToken) =>
            Task.FromResult(false);
    }
}
