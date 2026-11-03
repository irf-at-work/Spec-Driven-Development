using System.Reflection;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class DocumentSetupVersionTests
{
    [Fact]
    public void Parent_version_is_stable_for_an_unchanged_snapshot()
    {
        var document = CreatePopulated<STD_DOCUMENT>();

        Assert.Equal(DocumentSetupVersion.Create(document), DocumentSetupVersion.Create(document));
    }

    [Fact]
    public void Parent_version_changes_when_any_persisted_field_changes()
    {
        AssertEveryPropertyChangesVersion<STD_DOCUMENT>(DocumentSetupVersion.Create);
    }

    [Fact]
    public void Child_version_is_stable_for_an_unchanged_snapshot()
    {
        var module = CreatePopulated<STD_DOC_APPL_MODULE>();

        Assert.Equal(DocumentSetupVersion.Create(module), DocumentSetupVersion.Create(module));
    }

    [Fact]
    public void Child_version_changes_when_any_persisted_field_changes()
    {
        AssertEveryPropertyChangesVersion<STD_DOC_APPL_MODULE>(DocumentSetupVersion.Create);
    }

    private static void AssertEveryPropertyChangesVersion<T>(Func<T, string> createVersion)
        where T : new()
    {
        var row = CreatePopulated<T>();
        foreach (var property in typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public))
        {
            var originalValue = property.GetValue(row);
            var originalVersion = createVersion(row);

            property.SetValue(row, ChangedValue(property, originalValue));

            Assert.NotEqual(originalVersion, createVersion(row));
            property.SetValue(row, originalValue);
        }
    }

    private static T CreatePopulated<T>()
        where T : new()
    {
        var row = new T();
        foreach (var property in typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public))
        {
            property.SetValue(row, property.PropertyType switch
            {
                var type when type == typeof(string) => "before",
                var type when Nullable.GetUnderlyingType(type) == typeof(DateTime) => new DateTime(2026, 11, 2),
                var type when type == typeof(DateTime) => new DateTime(2026, 11, 2),
                var type when Nullable.GetUnderlyingType(type) == typeof(decimal) => 1m,
                var type when type == typeof(decimal) => 1m,
                _ => throw new InvalidOperationException($"Unexpected persisted property type: {property.PropertyType}."),
            });
        }

        return row;
    }

    private static object ChangedValue(PropertyInfo property, object? originalValue)
    {
        var type = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
        return type == typeof(string)
            ? $"{originalValue}-after"
            : type == typeof(DateTime)
                ? ((DateTime)originalValue!).AddDays(1)
                : type == typeof(decimal)
                    ? (decimal)originalValue! + 1m
                    : throw new InvalidOperationException($"Unexpected persisted property type: {property.PropertyType}.");
    }
}
