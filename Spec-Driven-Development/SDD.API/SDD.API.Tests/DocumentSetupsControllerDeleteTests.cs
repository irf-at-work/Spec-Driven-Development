using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Contracts;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class DocumentSetupsControllerDeleteTests
{
    [Fact]
    public async Task Delete_returns_not_found_for_a_missing_parent()
    {
        var service = CreateService(new FakeDocumentSetupsRepository());

        Assert.False(await service.DeleteAsync("MISSING", "version", default));
    }

    [Fact]
    public async Task Delete_rejects_an_expected_version_mismatch()
    {
        var document = new STD_DOCUMENT { DOC_CODE = "DOC-1", DOC_SETUP_FOR = "101" };
        var service = CreateService(new FakeDocumentSetupsRepository { Document = document });

        var exception = await Assert.ThrowsAsync<CodesApiException>(() =>
            service.DeleteAsync("DOC-1", "stale-version", default));

        Assert.Equal(StatusCodes.Status409Conflict, exception.StatusCode);
        Assert.Contains("reload", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Delete_is_blocked_when_children_exist_and_does_not_cascade()
    {
        var repository = new FakeDocumentSetupsRepository
        {
            Document = new STD_DOCUMENT { DOC_CODE = "DOC-1", DOC_SETUP_FOR = "101" },
            HasChildren = true,
        };
        var service = CreateService(repository);

        var exception = await Assert.ThrowsAsync<CodesApiException>(() =>
            service.DeleteAsync("DOC-1", DocumentSetupVersion.Create(repository.Document), default));

        Assert.Equal(StatusCodes.Status409Conflict, exception.StatusCode);
        Assert.True(repository.ParentExists);
        Assert.True(repository.HasChildren);
    }

    [Fact]
    public async Task Delete_removes_a_child_free_parent()
    {
        var repository = new FakeDocumentSetupsRepository
        {
            Document = new STD_DOCUMENT { DOC_CODE = "DOC-1", DOC_SETUP_FOR = "101" },
        };
        var service = CreateService(repository);

        var deleted = await service.DeleteAsync(
            "DOC-1",
            DocumentSetupVersion.Create(repository.Document),
            default);

        Assert.True(deleted);
        Assert.False(repository.ParentExists);
    }

    [Fact]
    public async Task Delete_requires_an_expected_version()
    {
        var service = CreateService(new FakeDocumentSetupsRepository());

        var exception = await Assert.ThrowsAsync<CodesApiException>(() =>
            service.DeleteAsync("DOC-1", string.Empty, default));

        Assert.Equal(StatusCodes.Status400BadRequest, exception.StatusCode);
    }

    private static DocumentSetupsService CreateService(FakeDocumentSetupsRepository repository) =>
        new(repository, new DocumentSetupValidator(), NullLogger<DocumentSetupsService>.Instance);

    private sealed class FakeDocumentSetupsRepository : IDocumentSetupsRepository
    {
        public STD_DOCUMENT? Document { get; set; }
        public bool HasChildren { get; init; }
        public bool ParentExists => Document is not null;

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
            Task.FromResult(new DateTime(2026, 11, 3));

        public Task AddAsync(STD_DOCUMENT document, CancellationToken cancellationToken) =>
            Task.CompletedTask;

        public Task SaveChangesAsync(CancellationToken cancellationToken) =>
            Task.CompletedTask;

        public Task<STD_DOCUMENT?> FindAsync(string docCode, CancellationToken cancellationToken) =>
            Task.FromResult(Document?.DOC_CODE == docCode ? Document : null);

        public Task<STD_DOCUMENT?> UpdateIfCurrentAsync(
            string docCode,
            string expectedVersion,
            Func<STD_DOCUMENT, CancellationToken, Task> update,
            CancellationToken cancellationToken) =>
            Task.FromResult<STD_DOCUMENT?>(null);

        public Task<bool> DeleteIfCurrentAndChildFreeAsync(
            string docCode,
            string expectedVersion,
            CancellationToken cancellationToken)
        {
            if (Document?.DOC_CODE != docCode)
            {
                return Task.FromResult(false);
            }

            if (!string.Equals(
                    DocumentSetupVersion.Create(Document),
                    expectedVersion,
                    StringComparison.Ordinal))
            {
                throw new CodesApiException(
                    StatusCodes.Status409Conflict,
                    "The document setup has changed.",
                    "Reload the document setup before deleting.");
            }

            if (HasChildren)
            {
                throw new CodesApiException(
                    StatusCodes.Status409Conflict,
                    "The document setup has applicable modules.",
                    "Delete its Applicable Module rows before deleting the document setup.");
            }

            Document = null;
            return Task.FromResult(true);
        }
    }
}
