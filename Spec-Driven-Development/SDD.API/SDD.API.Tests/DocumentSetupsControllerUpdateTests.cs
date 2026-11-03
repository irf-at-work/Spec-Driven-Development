using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Contracts;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class DocumentSetupsControllerUpdateTests
{
    [Fact]
    public async Task Get_returns_the_requested_document_setup()
    {
        var document = new STD_DOCUMENT
        {
            DOC_CODE = "DOC-1",
            DOC_SETUP_FOR = "101",
            DOC_CR_BY = "ADMIN",
        };
        var service = CreateService(new FakeDocumentSetupsRepository { Document = document });

        var result = await service.GetAsync("DOC-1", default);

        Assert.NotNull(result);
        Assert.Equal("DOC-1", result!.DocCode);
        Assert.Equal(DocumentSetupVersion.Create(document), result.Version);
    }

    [Fact]
    public async Task Update_keeps_doc_code_and_creation_audit_and_sets_update_audit()
    {
        var createdDate = new DateTime(2026, 10, 1, 8, 0, 0);
        var updateDate = new DateTime(2026, 11, 2, 9, 45, 0);
        var document = new STD_DOCUMENT
        {
            DOC_CODE = "DOC-EDIT",
            DOC_SETUP_FOR = "101",
            DOC_NAME = "Before",
            DOC_CR_BY = "ORIGINAL",
            DOC_CR_DT = createdDate,
        };
        var repository = new FakeDocumentSetupsRepository
        {
            Document = document,
            SystemDate = updateDate,
        };
        var service = CreateService(repository);

        var result = await service.UpdateAsync(
            "DOC-EDIT",
            new DocumentSetupUpdateRequest
            {
                DocCode = "DOC-EDIT",
                DocName = "After",
                DocSetupFor = "103",
                ExpectedVersion = DocumentSetupVersion.Create(document),
            },
            default);

        Assert.NotNull(result);
        Assert.Equal("DOC-EDIT", document.DOC_CODE);
        Assert.Equal("After", document.DOC_NAME);
        Assert.Equal("103", document.DOC_SETUP_FOR);
        Assert.Equal("ORIGINAL", document.DOC_CR_BY);
        Assert.Equal(createdDate, document.DOC_CR_DT);
        Assert.Equal("ADMIN", document.DOC_UP_BY);
        Assert.Equal(updateDate, document.DOC_UP_DT);
        Assert.Equal("ADMIN", result!.UpdatedBy);
        Assert.Equal(updateDate, result.UpdatedDate);
    }

    [Fact]
    public async Task Update_rejects_a_changed_document_identity()
    {
        var service = CreateService(new FakeDocumentSetupsRepository());

        var exception = await Assert.ThrowsAsync<CodesApiException>(() => service.UpdateAsync(
            "DOC-EDIT",
            new DocumentSetupUpdateRequest
            {
                DocCode = "DOC-OTHER",
                DocSetupFor = "101",
                ExpectedVersion = "version",
            },
            default));

        Assert.Equal(400, exception.StatusCode);
    }

    [Fact]
    public async Task Update_rejects_a_stale_version_with_reload_guidance()
    {
        var document = new STD_DOCUMENT { DOC_CODE = "DOC-EDIT", DOC_SETUP_FOR = "101" };
        var service = CreateService(new FakeDocumentSetupsRepository { Document = document });

        var exception = await Assert.ThrowsAsync<CodesApiException>(() => service.UpdateAsync(
            "DOC-EDIT",
            new DocumentSetupUpdateRequest
            {
                DocCode = "DOC-EDIT",
                DocSetupFor = "102",
                ExpectedVersion = "stale-version",
            },
            default));

        Assert.Equal(409, exception.StatusCode);
        Assert.Contains("reload", exception.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Equal("101", document.DOC_SETUP_FOR);
    }

    [Fact]
    public async Task Get_and_update_report_a_missing_record()
    {
        var service = CreateService(new FakeDocumentSetupsRepository());

        Assert.Null(await service.GetAsync("MISSING", default));
        Assert.Null(await service.UpdateAsync(
            "MISSING",
            new DocumentSetupUpdateRequest
            {
                DocCode = "MISSING",
                DocSetupFor = "101",
                ExpectedVersion = "version",
            },
            default));
    }

    private static DocumentSetupsService CreateService(FakeDocumentSetupsRepository repository) =>
        new(repository, new DocumentSetupValidator(), NullLogger<DocumentSetupsService>.Instance);

    private sealed class FakeDocumentSetupsRepository : IDocumentSetupsRepository
    {
        public STD_DOCUMENT? Document { get; init; }
        public DateTime SystemDate { get; init; } = new(2026, 11, 2);

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
            Task.FromResult(Document?.DOC_CODE == docCode);

        public Task<bool> SetupForCodeExistsAsync(string setupForCode, CancellationToken cancellationToken) =>
            Task.FromResult(true);

        public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
            Task.FromResult(SystemDate);

        public Task AddAsync(STD_DOCUMENT document, CancellationToken cancellationToken) =>
            Task.CompletedTask;

        public Task SaveChangesAsync(CancellationToken cancellationToken) =>
            Task.CompletedTask;

        public Task<STD_DOCUMENT?> FindAsync(string docCode, CancellationToken cancellationToken) =>
            Task.FromResult(Document?.DOC_CODE == docCode ? Document : null);

        public async Task<STD_DOCUMENT?> UpdateIfCurrentAsync(
            string docCode,
            string expectedVersion,
            Func<STD_DOCUMENT, CancellationToken, Task> update,
            CancellationToken cancellationToken)
        {
            var document = await FindAsync(docCode, cancellationToken);
            if (document is null)
            {
                return null;
            }

            if (!string.Equals(DocumentSetupVersion.Create(document), expectedVersion, StringComparison.Ordinal))
            {
                throw new CodesApiException(
                    409,
                    "The document setup has changed.",
                    "Reload the document setup before saving your changes.");
            }

            await update(document, cancellationToken);
            return document;
        }

        public Task<bool> DeleteIfCurrentAndChildFreeAsync(
            string docCode,
            string expectedVersion,
            CancellationToken cancellationToken) =>
            Task.FromResult(false);
    }
}
