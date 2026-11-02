using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Contracts;
using SDD.API.Controllers;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class CodesControllerListTests
{
    [Fact]
    public async Task List_uses_default_page_and_page_size()
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        await controller.List();

        Assert.Equal(1, service.RequestedPage);
        Assert.Equal(10, service.RequestedPageSize);
        Assert.Equal(CodeSortColumn.Code, service.RequestedSortBy);
        Assert.Equal(CodeSortDirection.Ascending, service.RequestedSortDirection);
        Assert.Empty(service.RequestedFilters);
    }

    [Fact]
    public async Task List_passes_selected_sort_to_service()
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        await controller.List(sortBy: CodeSortColumn.CodeDescription, sortDirection: CodeSortDirection.Descending);

        Assert.Equal(CodeSortColumn.CodeDescription, service.RequestedSortBy);
        Assert.Equal(CodeSortDirection.Descending, service.RequestedSortDirection);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public async Task List_rejects_undefined_sort_values(bool invalidSortBy, bool invalidDirection)
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        var result = await controller.List(
            sortBy: invalidSortBy ? (CodeSortColumn)999 : null,
            sortDirection: invalidDirection ? (CodeSortDirection)999 : null);

        var response = Assert.IsAssignableFrom<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
        Assert.IsAssignableFrom<ValidationProblemDetails>(response.Value);
    }

    [Fact]
    public async Task List_passes_all_column_filters_to_the_service()
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        await controller.List(
            codeOperator: CodeFilterOperator.Contains,
            codeValue: "usd",
            codeTypeOperator: CodeFilterOperator.EqualTo,
            codeTypeValue: "currency");

        Assert.Equal(
            [
                new CodeColumnFilter(CodeFilterColumn.Code, CodeFilterOperator.Contains, "usd"),
                new CodeColumnFilter(CodeFilterColumn.CodeType, CodeFilterOperator.EqualTo, "currency")
            ],
            service.RequestedFilters);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public async Task List_rejects_filter_without_its_operator_or_value(
        bool includeOperator,
        bool includeValue)
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        var result = await controller.List(
            codeOperator: includeOperator ? CodeFilterOperator.Contains : null,
            codeValue: includeValue ? "usd" : null);

        var response = Assert.IsAssignableFrom<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
        Assert.IsAssignableFrom<ValidationProblemDetails>(response.Value);
        Assert.Empty(service.RequestedFilters);
    }

    [Fact]
    public async Task List_rejects_undefined_filter_operator()
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        var result = await controller.List(
            codeOperator: (CodeFilterOperator)999,
            codeValue: "usd");

        var response = Assert.IsAssignableFrom<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
        Assert.IsAssignableFrom<ValidationProblemDetails>(response.Value);
        Assert.Empty(service.RequestedFilters);
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(1, 0)]
    [InlineData(-1, 10)]
    [InlineData(1, -1)]
    public async Task List_rejects_page_values_below_one(int page, int pageSize)
    {
        var controller = new CodesController(new FakeCodesService());

        var result = await controller.List(page, pageSize);

        var response = Assert.IsAssignableFrom<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, response.StatusCode);
        Assert.IsAssignableFrom<ProblemDetails>(response.Value);
    }

    [Fact]
    public async Task List_returns_empty_page_without_converting_it_to_an_error()
    {
        var service = new FakeCodesService();
        var controller = new CodesController(service);

        var result = await controller.List();

        var response = Assert.IsType<OkObjectResult>(result.Result);
        var page = Assert.IsType<PaginatedResult<CodeRecordResponse>>(response.Value);
        Assert.Empty(page.Items);
        Assert.Equal(0, page.TotalCount);
    }

    [Fact]
    public async Task List_does_not_convert_retrieval_errors_to_empty_results()
    {
        var service = new FakeCodesService
        {
            ListResult = (_, _, _, _, _, _) => throw new InvalidOperationException("database failure"),
        };
        var controller = new CodesController(service);

        await Assert.ThrowsAsync<InvalidOperationException>(() => controller.List());
    }

    [Fact]
    public async Task List_preserves_selected_record_fields()
    {
        var record = new CodeRecordResponse
        {
            Code = "PAY",
            CodeType = "METHOD",
            CompanyCode = "PAY",
            CodeDescription = "Payment method",
            Value1 = "CARD",
            Value2 = null,
            CreatedBy = "ADMIN",
            CreatedDate = new DateTime(2025, 1, 15),
        };
        var service = new FakeCodesService
        {
            ListResult = (page, pageSize, _, _, _, _) => Task.FromResult(
                new PaginatedResult<CodeRecordResponse>([record], page, pageSize, 1)),
        };
        var controller = new CodesController(service);

        var result = await controller.List();

        var response = Assert.IsType<OkObjectResult>(result.Result);
        var page = Assert.IsType<PaginatedResult<CodeRecordResponse>>(response.Value);
        var listedRecord = Assert.Single(page.Items);
        Assert.Equal("PAY", listedRecord.Code);
        Assert.Equal("METHOD", listedRecord.CodeType);
        Assert.Equal("PAY", listedRecord.CompanyCode);
        Assert.Equal("Payment method", listedRecord.CodeDescription);
        Assert.Equal("CARD", listedRecord.Value1);
        Assert.Equal("ADMIN", listedRecord.CreatedBy);
        Assert.Equal(new DateTime(2025, 1, 15), listedRecord.CreatedDate);
    }

    private sealed class FakeCodesService : ICodesService
    {
        public int RequestedPage { get; private set; }
        public int RequestedPageSize { get; private set; }
        public CodeSortColumn RequestedSortBy { get; private set; }
        public CodeSortDirection RequestedSortDirection { get; private set; }
        public IReadOnlyList<CodeColumnFilter> RequestedFilters { get; private set; } = [];

        public Func<int, int, IReadOnlyList<CodeColumnFilter>, CodeSortColumn, CodeSortDirection, CancellationToken, Task<PaginatedResult<CodeRecordResponse>>> ListResult
        {
            get;
            init;
        } = (page, pageSize, _, _, _, _) => Task.FromResult(
            new PaginatedResult<CodeRecordResponse>([], page, pageSize, 0));

        public Task<PaginatedResult<CodeRecordResponse>> ListAsync(
            int page,
            int pageSize,
            IReadOnlyList<CodeColumnFilter> filters,
            CodeSortColumn sortBy,
            CodeSortDirection sortDirection,
            CancellationToken cancellationToken)
        {
            RequestedPage = page;
            RequestedPageSize = pageSize;
            RequestedSortBy = sortBy;
            RequestedSortDirection = sortDirection;
            RequestedFilters = filters;
            return ListResult(page, pageSize, filters, sortBy, sortDirection, cancellationToken);
        }

        public Task<CodeRecordResponse?> GetAsync(
            string code,
            string codeType,
            CancellationToken cancellationToken) =>
            Task.FromResult<CodeRecordResponse?>(null);

        public Task<CodeRecordResponse> CreateAsync(
            CodeWriteRequest request,
            CancellationToken cancellationToken) =>
            throw new NotImplementedException();

        public Task<CodeRecordResponse?> UpdateAsync(
            string code,
            string codeType,
            CodeWriteRequest request,
            CancellationToken cancellationToken) =>
            Task.FromResult<CodeRecordResponse?>(null);

        public Task<bool> DeleteAsync(
            string code,
            string codeType,
            CancellationToken cancellationToken) =>
            Task.FromResult(false);
    }
}
