using System.Linq.Expressions;

namespace SDD.API.Services;

public enum TextFilterOperator
{
    Contains,
    StartsWith,
    EndsWith,
    EqualTo,
    NotEqualTo
}

/// <summary>One text column's filter: the text the user typed and the operator they chose (blank means "contains").</summary>
public sealed record TextFilter(string? Value = null, string? Operator = null);

/// <summary>The Status filter: Active (true) or Inactive (false), with "equals" (the default) or "notEquals".</summary>
public sealed record StatusFilter(bool? Value = null, string? Operator = null);

/// <summary>
/// The four filters shared by the makes list and the models list (FR-030): code, name, short name and status.
/// Every filter is optional, and a filter with a blank value is ignored.
/// </summary>
public sealed record ColumnFilters(TextFilter Code, TextFilter Name, TextFilter ShortName, StatusFilter Active)
{
    public static ColumnFilters None { get; } = new(new TextFilter(), new TextFilter(), new TextFilter(), new StatusFilter());
}

/// <summary>
/// Turns column filters into a database query. All filters must match (AND), matching ignores upper and lower case,
/// and what the user typed is plain text: the database provider escapes % and _ so they are never wildcards.
/// </summary>
public static class ColumnFilterQuery
{
    private const string TextOperatorMessage = "Operator must be startsWith, endsWith, contains, equals or notEquals.";
    private const string StatusOperatorMessage = "Operator must be equals or notEquals.";

    private static readonly Dictionary<string, TextFilterOperator> TextOperators =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["contains"] = TextFilterOperator.Contains,
            ["startsWith"] = TextFilterOperator.StartsWith,
            ["endsWith"] = TextFilterOperator.EndsWith,
            ["equals"] = TextFilterOperator.EqualTo,
            ["notEquals"] = TextFilterOperator.NotEqualTo
        };

    private static readonly System.Reflection.MethodInfo UpperMethod =
        typeof(string).GetMethod(nameof(string.ToUpper), Type.EmptyTypes)!;

    private static readonly System.Reflection.MethodInfo ContainsMethod =
        typeof(string).GetMethod(nameof(string.Contains), [typeof(string)])!;

    private static readonly System.Reflection.MethodInfo StartsWithMethod =
        typeof(string).GetMethod(nameof(string.StartsWith), [typeof(string)])!;

    private static readonly System.Reflection.MethodInfo EndsWithMethod =
        typeof(string).GetMethod(nameof(string.EndsWith), [typeof(string)])!;

    // Holds the typed text. Reading it through a property of an object lets the database provider send it as a
    // bound value, so what the user typed never becomes part of the SQL text.
    private sealed record FilterTerm(string Text);

    public static bool TryParseTextOperator(string? name, out TextFilterOperator filterOperator)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            filterOperator = TextFilterOperator.Contains;
            return true;
        }

        return TextOperators.TryGetValue(name.Trim(), out filterOperator);
    }

    /// <summary>The status filter's operator: returns whether the result is reversed ("notEquals").</summary>
    public static bool TryParseStatusOperator(string? name, out bool notEquals)
    {
        notEquals = false;
        if (string.IsNullOrWhiteSpace(name))
        {
            return true;
        }

        if (string.Equals(name.Trim(), "equals", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (string.Equals(name.Trim(), "notEquals", StringComparison.OrdinalIgnoreCase))
        {
            notEquals = true;
            return true;
        }

        return false;
    }

    public static void ValidatePage(int page, IDictionary<string, string[]> errors)
    {
        if (page < 1 || page > VehicleMakeListQuery.MaximumPage)
        {
            errors["page"] = [$"Page must be a number from 1 to {VehicleMakeListQuery.MaximumPage}."];
        }
    }

    /// <summary>
    /// Checks the operators. The errors are keyed by parameter name (for example <c>makeNameOperator</c>), so
    /// <paramref name="codeField"/> and <paramref name="nameField"/> are "makeCode"/"makeName" or "modelCode"/"modelName".
    /// </summary>
    public static void ValidateOperators(
        ColumnFilters filters,
        string codeField,
        string nameField,
        IDictionary<string, string[]> errors)
    {
        CheckText(filters.Code.Operator, codeField + "Operator", errors);
        CheckText(filters.Name.Operator, nameField + "Operator", errors);
        CheckText(filters.ShortName.Operator, "shortNameOperator", errors);

        if (!TryParseStatusOperator(filters.Active.Operator, out _))
        {
            errors["activeOperator"] = [StatusOperatorMessage];
        }
    }

    /// <summary>Assumes <see cref="ValidateOperators"/> has already passed.</summary>
    public static IQueryable<T> Apply<T>(
        IQueryable<T> source,
        ColumnFilters filters,
        Expression<Func<T, string?>> code,
        Expression<Func<T, string?>> name,
        Expression<Func<T, string?>> shortName,
        Expression<Func<T, string?>> activeFlag)
    {
        // One Where per filter: separate Where calls combine with AND.
        source = WhereText(source, code, filters.Code);
        source = WhereText(source, name, filters.Name);
        source = WhereText(source, shortName, filters.ShortName);
        return WhereStatus(source, activeFlag, filters.Active);
    }

    private static void CheckText(string? name, string field, IDictionary<string, string[]> errors)
    {
        if (!TryParseTextOperator(name, out _))
        {
            errors[field] = [TextOperatorMessage];
        }
    }

    private static IQueryable<T> WhereText<T>(
        IQueryable<T> source,
        Expression<Func<T, string?>> column,
        TextFilter filter)
    {
        // Upper-casing both sides makes the filter ignore case, whatever the database's own collation does.
        var text = filter.Value?.Trim().ToUpperInvariant();
        if (string.IsNullOrEmpty(text) || !TryParseTextOperator(filter.Operator, out var filterOperator))
        {
            return source;
        }

        var term = Expression.Property(Expression.Constant(new FilterTerm(text)), nameof(FilterTerm.Text));
        var value = column.Body;
        var nothing = Expression.Constant(null, typeof(string));
        var upper = Expression.Call(value, UpperMethod);

        // "Not equal to" also lists records whose value is empty (owner decision, 30-Oct-2026); in Oracle an empty
        // text is stored as null. Every other operator needs a value to look at.
        Expression test = filterOperator switch
        {
            TextFilterOperator.NotEqualTo =>
                Expression.OrElse(Expression.Equal(value, nothing), Expression.NotEqual(upper, term)),
            TextFilterOperator.StartsWith =>
                Expression.AndAlso(Expression.NotEqual(value, nothing), Expression.Call(upper, StartsWithMethod, term)),
            TextFilterOperator.EndsWith =>
                Expression.AndAlso(Expression.NotEqual(value, nothing), Expression.Call(upper, EndsWithMethod, term)),
            TextFilterOperator.EqualTo =>
                Expression.AndAlso(Expression.NotEqual(value, nothing), Expression.Equal(upper, term)),
            _ =>
                Expression.AndAlso(Expression.NotEqual(value, nothing), Expression.Call(upper, ContainsMethod, term))
        };

        return source.Where(Expression.Lambda<Func<T, bool>>(test, column.Parameters));
    }

    private static IQueryable<T> WhereStatus<T>(
        IQueryable<T> source,
        Expression<Func<T, string?>> flag,
        StatusFilter filter)
    {
        if (filter.Value is not { } wanted || !TryParseStatusOperator(filter.Operator, out var notEquals))
        {
            return source;
        }

        var wantActive = notEquals ? !wanted : wanted;
        var value = flag.Body;
        var nothing = Expression.Constant(null, typeof(string));
        var inactive = Expression.Constant(VehicleMakeMapping.InactiveFlag, typeof(string));

        // A row with no flag at all counts as Active (see VehicleMakeMapping.IsActive).
        Expression test = wantActive
            ? Expression.OrElse(Expression.Equal(value, nothing), Expression.NotEqual(value, inactive))
            : Expression.Equal(value, inactive);

        return source.Where(Expression.Lambda<Func<T, bool>>(test, flag.Parameters));
    }
}
