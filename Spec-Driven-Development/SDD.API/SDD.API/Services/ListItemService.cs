using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Text.Json;
using SDD.API.Common;
using SDD.API.Contracts;
using SDD.API.Data.Entities;

namespace SDD.API.Services;

public sealed class ListItemService(
    IListItemRepository repository,
    TimeProvider? timeProvider = null)
{
    private static readonly IReadOnlyDictionary<string, string> SortColumns =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["liType"] = "liType",
            ["liCode"] = "liCode",
            ["description"] = "description",
            ["shortDescription"] = "shortDescription",
            ["value"] = "value",
            ["activeYn"] = "activeYn",
        };

    private readonly TimeProvider _timeProvider = timeProvider ?? TimeProvider.System;

    public async Task<PaginatedResult<ListItemListItemDto>> ListAsync(
        ListItemListQuery request,
        CancellationToken cancellationToken)
    {
        ValidateListQuery(request);
        IQueryable<StdListItem> items = repository.ListItems;
        items = ApplyTextFilter(items, request.LiType, request.LiTypeOperator, item => item.LiType);
        items = ApplyTextFilter(items, request.LiCode, request.LiCodeOperator, item => item.LiCode);
        items = ApplyTextFilter(items, request.Description, request.DescriptionOperator, item => item.LiDesc);
        items = ApplyTextFilter(items, request.ShortDescription, request.ShortDescriptionOperator, item => item.LiShortDesc);
        items = ApplyTextFilter(items, request.Value, request.ValueOperator, item => item.LiValue);
        if (!string.IsNullOrWhiteSpace(request.ActiveYn))
        {
            items = items.Where(item => item.LiActiveYn == request.ActiveYn.Trim().ToUpperInvariant());
        }

        var totalCount = await repository.CountAsync(items, cancellationToken);
        var offset = (long)(request.Page - 1) * request.PageSize;
        var pageItems = offset > int.MaxValue
            ? []
            : await repository.ToListAsync(
                ApplyOrdering(items, request.SortBy, request.SortDirection)
                    .Skip((int)offset)
                    .Take(request.PageSize),
                cancellationToken);

        return new PaginatedResult<ListItemListItemDto>
        {
            Items = pageItems.Select(ToListItem).ToArray(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<ListItemDto?> GetAsync(
        string liType,
        string liCode,
        CancellationToken cancellationToken)
    {
        var rows = await repository.ToListAsync(
            repository.ListItems.Where(item => item.LiType == liType && item.LiCode == liCode),
            cancellationToken);
        return rows.Count == 0 ? null : ToDetails(rows[0]);
    }

    public async Task<ListItemDto> CreateAsync(
        CreateListItemRequest request,
        CancellationToken cancellationToken)
    {
        Validate(request);
        var item = new StdListItem
        {
            LiType = request.LiType,
            LiCode = request.LiCode,
            LiDesc = request.Description,
            LiDescL2 = request.DescriptionL2,
            LiShortDesc = request.ShortDescription,
            LiShortDescL2 = request.ShortDescriptionL2,
            LiValue = request.Value,
            LiActiveYn = request.ActiveYn ?? "Y",
            LiFlex01 = request.Flex01,
            LiFlex02 = request.Flex02,
            LiCrBy = "Admin",
            LiCrDt = _timeProvider.GetUtcNow().UtcDateTime,
            LiUpBy = "Admin",
            LiUpDt = _timeProvider.GetUtcNow().UtcDateTime,
        };

        if (await repository.AnyAsync(
            repository.ListItems.Where(existing =>
                existing.LiType == item.LiType && existing.LiCode == item.LiCode),
            cancellationToken))
        {
            throw new ListItemConflictException("A list item with this type and code already exists.");
        }

        repository.Add(item);
        await repository.SaveChangesAsync(cancellationToken);

        return ToDetails(item);
    }

    public async Task<ListItemDto?> UpdateAsync(
        string liType,
        string liCode,
        UpdateListItemRequest request,
        CancellationToken cancellationToken)
    {
        Validate(request);
        var rows = await repository.ToListAsync(
            repository.ListItems.Where(item => item.LiType == liType && item.LiCode == liCode),
            cancellationToken);
        if (rows.Count == 0)
        {
            return null;
        }

        var item = rows[0];
        if (request.Description is not null) item.LiDesc = request.Description;
        if (request.DescriptionL2 is not null) item.LiDescL2 = request.DescriptionL2;
        if (request.ShortDescription is not null) item.LiShortDesc = request.ShortDescription;
        if (request.ShortDescriptionL2 is not null) item.LiShortDescL2 = request.ShortDescriptionL2;
        if (request.Value is not null) item.LiValue = request.Value;
        if (request.ActiveYn is not null) item.LiActiveYn = request.ActiveYn;
        if (request.Flex01 is not null) item.LiFlex01 = request.Flex01;
        if (request.Flex02 is not null) item.LiFlex02 = request.Flex02;
        item.LiUpBy = "Admin";
        item.LiUpDt = _timeProvider.GetUtcNow().UtcDateTime;

        await repository.SaveChangesAsync(cancellationToken);
        return ToDetails(item);
    }

    public async Task<bool> DeleteAsync(
        string liType,
        string liCode,
        CancellationToken cancellationToken)
    {
        var rows = await repository.ToListAsync(
            repository.ListItems.Where(item => item.LiType == liType && item.LiCode == liCode),
            cancellationToken);
        if (rows.Count == 0)
        {
            return false;
        }

        repository.Remove(rows[0]);
        await repository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static IQueryable<StdListItem> ApplyTextFilter(
        IQueryable<StdListItem> items,
        string? value,
        ListItemFilterOperator? operation,
        Expression<Func<StdListItem, string?>> field)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return items;
        }

        var fieldValue = field.Body;
        var notNull = Expression.NotEqual(fieldValue, Expression.Constant(null, typeof(string)));
        var lower = Expression.Call(fieldValue, nameof(string.ToLower), Type.EmptyTypes);
        var term = Expression.Constant(value.Trim().ToLowerInvariant());
        var filterOperator = operation ?? ListItemFilterOperator.Contains;
        Expression comparison = filterOperator switch
        {
            ListItemFilterOperator.StartsWith =>
                Expression.Call(lower, nameof(string.StartsWith), Type.EmptyTypes, term),
            ListItemFilterOperator.EndsWith =>
                Expression.Call(lower, nameof(string.EndsWith), Type.EmptyTypes, term),
            ListItemFilterOperator.Contains or ListItemFilterOperator.DoesNotContain =>
                Expression.Call(lower, nameof(string.Contains), Type.EmptyTypes, term),
            ListItemFilterOperator.Equals or ListItemFilterOperator.NotEquals =>
                Expression.Equal(lower, term),
            _ => throw new InvalidOperationException("The list item filter operator was not validated."),
        };
        if (filterOperator is ListItemFilterOperator.DoesNotContain or ListItemFilterOperator.NotEquals)
        {
            comparison = Expression.Not(comparison);
        }

        return items.Where(Expression.Lambda<Func<StdListItem, bool>>(
            Expression.AndAlso(notNull, comparison),
            field.Parameters));
    }

    private static IQueryable<StdListItem> ApplyOrdering(
        IQueryable<StdListItem> items,
        string sortBy,
        string sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);
        var ordered = (sortBy.ToLowerInvariant(), descending) switch
        {
            ("litype", false) => items.OrderBy(item => item.LiType),
            ("litype", true) => items.OrderByDescending(item => item.LiType),
            ("licode", false) => items.OrderBy(item => item.LiCode),
            ("licode", true) => items.OrderByDescending(item => item.LiCode),
            ("description", false) => items.OrderBy(item => item.LiDesc),
            ("description", true) => items.OrderByDescending(item => item.LiDesc),
            ("shortdescription", false) => items.OrderBy(item => item.LiShortDesc),
            ("shortdescription", true) => items.OrderByDescending(item => item.LiShortDesc),
            ("value", false) => items.OrderBy(item => item.LiValue),
            ("value", true) => items.OrderByDescending(item => item.LiValue),
            ("activeyn", false) => items.OrderBy(item => item.LiActiveYn),
            ("activeyn", true) => items.OrderByDescending(item => item.LiActiveYn),
            _ => throw new InvalidOperationException("The list item sort field was not validated."),
        };
        return ordered.ThenBy(item => item.LiType).ThenBy(item => item.LiCode);
    }

    private static ListItemListItemDto ToListItem(StdListItem item) => new()
    {
        LiType = item.LiType,
        LiCode = item.LiCode,
        Description = item.LiDesc,
        ShortDescription = item.LiShortDesc,
        Value = item.LiValue,
        ActiveYn = item.LiActiveYn,
        CreatedBy = item.LiCrBy,
        LastUpdatedBy = item.LiUpBy,
    };

    private static ListItemDto ToDetails(StdListItem item) => new()
    {
        LiType = item.LiType,
        LiCode = item.LiCode,
        Description = item.LiDesc,
        DescriptionL2 = item.LiDescL2,
        ShortDescription = item.LiShortDesc,
        ShortDescriptionL2 = item.LiShortDescL2,
        Value = item.LiValue,
        ActiveYn = item.LiActiveYn,
        Flex01 = item.LiFlex01,
        Flex02 = item.LiFlex02,
        CreatedBy = item.LiCrBy,
        CreatedAt = ToUtc(item.LiCrDt),
        LastUpdatedBy = item.LiUpBy,
        LastUpdatedAt = ToUtc(item.LiUpDt),
    };

    private static DateTime? ToUtc(DateTime? value) =>
        value is null ? null : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc);

    private static void ValidateListQuery(ListItemListQuery request)
    {
        var errors = new Dictionary<string, string[]>();
        if (request.Page < 1)
        {
            errors[nameof(request.Page)] = ["Page must be greater than zero."];
        }
        if (request.PageSize < 1)
        {
            errors[nameof(request.PageSize)] = ["Page size must be greater than zero."];
        }
        if (string.IsNullOrWhiteSpace(request.SortBy) || !SortColumns.ContainsKey(request.SortBy))
        {
            errors["sortBy"] = ["Choose a supported list item column to sort by."];
        }
        if (!string.Equals(request.SortDirection, "asc", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(request.SortDirection, "desc", StringComparison.OrdinalIgnoreCase))
        {
            errors["sortDirection"] = ["Sort direction must be 'asc' or 'desc'."];
        }

        foreach (var (name, value) in new (string Name, ListItemFilterOperator? Value)[]
        {
            (nameof(request.LiTypeOperator), request.LiTypeOperator),
            (nameof(request.LiCodeOperator), request.LiCodeOperator),
            (nameof(request.DescriptionOperator), request.DescriptionOperator),
            (nameof(request.ShortDescriptionOperator), request.ShortDescriptionOperator),
            (nameof(request.ValueOperator), request.ValueOperator),
        })
        {
            if (value is not null && !Enum.IsDefined(value.Value))
            {
                errors[JsonNamingPolicy.CamelCase.ConvertName(name)] = ["Choose a supported text filter operator."];
            }
        }

        var offset = ((long)request.Page - 1) * request.PageSize;
        if (request.Page > 0 && request.PageSize > 0 && offset > int.MaxValue)
        {
            errors["page"] = ["The requested page is too large."];
        }
        if (request.ActiveYn is not null
            && request.ActiveYn is not ("Y" or "N")
            && !string.Equals(request.ActiveYn, "Y", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(request.ActiveYn, "N", StringComparison.OrdinalIgnoreCase))
        {
            errors["activeYn"] = ["Active status must be 'Y' or 'N'."];
        }

        if (errors.Count > 0)
        {
            throw new ListItemValidationException(errors);
        }
    }

    private static void Validate(object request)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(request, new ValidationContext(request), results, validateAllProperties: true);
        var errors = results
            .SelectMany(result => result.MemberNames.DefaultIfEmpty(string.Empty)
                .Select(member => (
                    member: JsonNamingPolicy.CamelCase.ConvertName(member),
                    error: result.ErrorMessage ?? "The value is invalid.")))
            .GroupBy(entry => entry.member)
            .ToDictionary(group => group.Key, group => group.Select(entry => entry.error).ToArray());
        if (errors.Count > 0)
        {
            throw new ListItemValidationException(errors);
        }
    }

}

public sealed class ListItemValidationException(IReadOnlyDictionary<string, string[]> errors)
    : Exception("The list item request is invalid.")
{
    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}

public sealed class ListItemConflictException(string message) : Exception(message);

public sealed class ListItemReferenceException()
    : Exception("The list item is referenced by other records and cannot be removed.");
