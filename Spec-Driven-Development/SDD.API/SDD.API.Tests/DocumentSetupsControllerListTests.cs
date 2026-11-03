using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Controllers;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class DocumentSetupsControllerListTests
{
    [Fact]
    public async Task List_uses_page_one_and_size_ten_by_default()
    {
        var service = new FakeDocumentSetupsService();
        var controller = new DocumentSetupsController(service);

        var result = await controller.List();

        Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(1, service.Page);
        Assert.Equal(10, service.PageSize);
        Assert.Equal(DocumentSetupSortColumn.DocCode, service.SortBy);
        Assert.Equal(CodeSortDirection.Ascending, service.SortDirection);
        Assert.Empty(service.Filters);
    }

    [Fact]
    public async Task List_passes_requested_sort_to_the_service()
    {
        var service = new FakeDocumentSetupsService();
        var controller = new DocumentSetupsController(service);

        var result = await controller.List(
            sortBy: DocumentSetupSortColumn.DocName,
            sortDirection: CodeSortDirection.Descending);

        Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(DocumentSetupSortColumn.DocName, service.SortBy);
        Assert.Equal(CodeSortDirection.Descending, service.SortDirection);
    }

    [Theory]
    [InlineData(10)]
    [InlineData(15)]
    [InlineData(20)]
    [InlineData(50)]
    public async Task List_accepts_supported_page_sizes(int pageSize)
    {
        var service = new FakeDocumentSetupsService();
        var controller = new DocumentSetupsController(service);

        var result = await controller.List(pageSize: pageSize);

        Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(pageSize, service.PageSize);
    }

    [Fact]
    public async Task List_rejects_unsupported_page_sizes()
    {
        var controller = new DocumentSetupsController(new FakeDocumentSetupsService());

        var result = await controller.List(pageSize: 5);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.IsType<ValidationProblemDetails>(badRequest.Value);
    }

    [Theory]
    [InlineData(CodeFilterOperator.StartsWith)]
    [InlineData(CodeFilterOperator.EndsWith)]
    [InlineData(CodeFilterOperator.Contains)]
    [InlineData(CodeFilterOperator.DoesNotContain)]
    [InlineData(CodeFilterOperator.EqualTo)]
    [InlineData(CodeFilterOperator.NotEqualTo)]
    public async Task List_passes_each_supported_operator_to_the_service(CodeFilterOperator filterOperator)
    {
        var service = new FakeDocumentSetupsService();
        var controller = new DocumentSetupsController(service);

        var result = await controller.List(
            docCodeOperator: filterOperator,
            docCodeValue: "abc");

        Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(
            new DocumentSetupFilter(DocumentSetupFilterColumn.DocCode, filterOperator, "abc"),
            Assert.Single(service.Filters));
    }

    [Fact]
    public async Task List_passes_description_filter_to_the_service()
    {
        var service = new FakeDocumentSetupsService();
        var controller = new DocumentSetupsController(service);

        var result = await controller.List(
            docDescriptionOperator: CodeFilterOperator.Contains,
            docDescriptionValue: "policy");

        Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(
            new DocumentSetupFilter(DocumentSetupFilterColumn.DocDescription, CodeFilterOperator.Contains, "policy"),
            Assert.Single(service.Filters));
    }

    [Theory]
    [InlineData(null, "value")]
    [InlineData(CodeFilterOperator.Contains, null)]
    [InlineData(CodeFilterOperator.Contains, " ")]
    public async Task List_rejects_incomplete_filter_pairs(
        CodeFilterOperator? filterOperator,
        string? value)
    {
        var controller = new DocumentSetupsController(new FakeDocumentSetupsService());

        var result = await controller.List(
            docNameOperator: filterOperator,
            docNameValue: value);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.IsType<ValidationProblemDetails>(badRequest.Value);
    }

    [Fact]
    public void Query_filters_ignore_case_combine_with_and_and_order_before_paging()
    {
        var records = new[]
        {
            new STD_DOCUMENT { DOC_CODE = "ZAB", DOC_NAME = "Travel", DOC_DESC = "Policy ABC", DOC_SETUP_FOR = "101" },
            new STD_DOCUMENT { DOC_CODE = "AAB", DOC_NAME = "TRAVEL", DOC_DESC = "policy travel", DOC_SETUP_FOR = "101" },
            new STD_DOCUMENT { DOC_CODE = "BAB", DOC_NAME = "Travel", DOC_DESC = "Other", DOC_SETUP_FOR = "102" },
            new STD_DOCUMENT { DOC_CODE = "AAX", DOC_NAME = "Travel", DOC_DESC = "Other", DOC_SETUP_FOR = "101" },
        };
        var filters = new[]
        {
            new DocumentSetupFilter(DocumentSetupFilterColumn.DocCode, CodeFilterOperator.Contains, "ab"),
            new DocumentSetupFilter(DocumentSetupFilterColumn.DocName, CodeFilterOperator.EqualTo, "travel"),
            new DocumentSetupFilter(DocumentSetupFilterColumn.DocDescription, CodeFilterOperator.Contains, "policy"),
            new DocumentSetupFilter(DocumentSetupFilterColumn.SetupFor, CodeFilterOperator.EqualTo, "101"),
        };

        var matches = DocumentSetupQuery.ApplyFilters(records.AsQueryable(), filters);
        var page = DocumentSetupQuery.ApplySort(
                matches,
                DocumentSetupSortColumn.DocCode,
                CodeSortDirection.Ascending)
            .Skip(0)
            .Take(1)
            .ToArray();

        Assert.Equal(2, matches.Count());
        Assert.Equal("AAB", Assert.Single(page).DOC_CODE);
    }

    [Theory]
    [InlineData(CodeSortDirection.Ascending, "AAB", "BAB")]
    [InlineData(CodeSortDirection.Descending, "ZAB", "BAB")]
    public void Query_sorts_before_paging(
        CodeSortDirection direction,
        string firstCode,
        string expectedSecondCode)
    {
        var records = new[]
        {
            new STD_DOCUMENT { DOC_CODE = "ZAB", DOC_NAME = "Travel" },
            new STD_DOCUMENT { DOC_CODE = "AAB", DOC_NAME = "Accounts" },
            new STD_DOCUMENT { DOC_CODE = "BAB", DOC_NAME = "Policy" },
        };

        var sorted = DocumentSetupQuery.ApplySort(records.AsQueryable(), DocumentSetupSortColumn.DocName, direction)
            .ToArray();

        Assert.Equal(firstCode, sorted[0].DOC_CODE);
        Assert.Equal(expectedSecondCode, sorted[1].DOC_CODE);
    }

    [Theory]
    [InlineData(CodeFilterOperator.StartsWith, "abc", true)]
    [InlineData(CodeFilterOperator.StartsWith, "bc", false)]
    [InlineData(CodeFilterOperator.EndsWith, "BC", true)]
    [InlineData(CodeFilterOperator.EndsWith, "ab", false)]
    [InlineData(CodeFilterOperator.Contains, "bC", true)]
    [InlineData(CodeFilterOperator.Contains, "xyz", false)]
    [InlineData(CodeFilterOperator.DoesNotContain, "xyz", true)]
    [InlineData(CodeFilterOperator.DoesNotContain, "Bc", false)]
    [InlineData(CodeFilterOperator.EqualTo, "aBc", true)]
    [InlineData(CodeFilterOperator.EqualTo, "abc ", false)]
    [InlineData(CodeFilterOperator.NotEqualTo, "xyz", true)]
    [InlineData(CodeFilterOperator.NotEqualTo, "ABC", false)]
    public void Query_supports_every_case_insensitive_filter_operator(
        CodeFilterOperator filterOperator,
        string value,
        bool expected)
    {
        var records = new[] { new STD_DOCUMENT { DOC_CODE = "AbC" } };
        var filters = new[]
        {
            new DocumentSetupFilter(DocumentSetupFilterColumn.DocCode, filterOperator, value),
        };

        Assert.Equal(expected, DocumentSetupQuery.ApplyFilters(records.AsQueryable(), filters).Any());
    }

    [Theory]
    [InlineData(CodeFilterOperator.StartsWith, "abc", true)]
    [InlineData(CodeFilterOperator.EndsWith, "policy", true)]
    [InlineData(CodeFilterOperator.Contains, "LIC", true)]
    [InlineData(CodeFilterOperator.DoesNotContain, "other", true)]
    [InlineData(CodeFilterOperator.EqualTo, "a policy", true)]
    [InlineData(CodeFilterOperator.NotEqualTo, "different", true)]
    public void Query_filters_document_description(
        CodeFilterOperator filterOperator,
        string value,
        bool expected)
    {
        var records = new[]
        {
            new STD_DOCUMENT { DOC_DESC = "ABC policy" },
            new STD_DOCUMENT { DOC_DESC = "A policy" },
        };
        var filters = new[]
        {
            new DocumentSetupFilter(
                DocumentSetupFilterColumn.DocDescription,
                filterOperator,
                value),
        };

        Assert.Equal(expected, DocumentSetupQuery.ApplyFilters(records.AsQueryable(), filters).Any());
    }

    private sealed class FakeDocumentSetupsService : IDocumentSetupsService
    {
        public int Page { get; private set; }
        public int PageSize { get; private set; }
        public IReadOnlyList<DocumentSetupFilter> Filters { get; private set; } = [];
        public DocumentSetupSortColumn SortBy { get; private set; }
        public CodeSortDirection SortDirection { get; private set; }

        public Task<PaginatedResult<DocumentSetupSummary>> ListAsync(
            int page,
            int pageSize,
            IReadOnlyList<DocumentSetupFilter> filters,
            DocumentSetupSortColumn sortBy,
            CodeSortDirection sortDirection,
            CancellationToken cancellationToken)
        {
            Page = page;
            PageSize = pageSize;
            Filters = filters;
            SortBy = sortBy;
            SortDirection = sortDirection;
            return Task.FromResult(new PaginatedResult<DocumentSetupSummary>([], page, pageSize, 0));
        }

        public Task<DocumentSetupRecord?> GetAsync(string docCode, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<DocumentSetupRecord> CreateAsync(
            DocumentSetupWriteRequest request,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<DocumentSetupRecord?> UpdateAsync(
            string docCode,
            DocumentSetupUpdateRequest request,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<bool> DeleteAsync(
            string docCode,
            string expectedVersion,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }
}
