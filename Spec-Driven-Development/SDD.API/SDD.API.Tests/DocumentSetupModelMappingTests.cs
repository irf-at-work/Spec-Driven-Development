using System.Collections;
using System.Reflection;

namespace SDD.API.Tests;

public sealed class DocumentSetupModelMappingTests
{
    [Fact]
    public void Document_tables_match_the_supplied_Oracle_DDL()
    {
        using var context = CreateContext();
        var model = ReadProperty(context, "Model")!;
        var entityTypes = ReadEnumerable(model, "GetEntityTypes");

        var document = AssertEntity(entityTypes, "STD_DOCUMENT", "DOC_CODE");
        AssertColumns(document, new Dictionary<string, string>
        {
            ["DOC_CODE"] = "VARCHAR2(12 BYTE)",
            ["DOC_NAME"] = "VARCHAR2(100 BYTE)",
            ["DOC_NAME_L2"] = "VARCHAR2(100 BYTE)",
            ["DOC_DESC"] = "VARCHAR2(2000 BYTE)",
            ["DOC_DESC_L2"] = "VARCHAR2(2000 BYTE)",
            ["DOC_SETUP_FOR"] = "VARCHAR2(12 BYTE)",
            ["DOC_ACTIVE_YN"] = "VARCHAR2(1 BYTE)",
            ["DOC_FLEX_01"] = "VARCHAR2(60 BYTE)",
            ["DOC_FLEX_02"] = "VARCHAR2(60 BYTE)",
            ["DOC_CR_BY"] = "VARCHAR2(12 BYTE)",
            ["DOC_CR_DT"] = "DATE",
            ["DOC_UP_BY"] = "VARCHAR2(12 BYTE)",
            ["DOC_UP_DT"] = "DATE",
        });

        var modules = AssertEntity(entityTypes, "STD_DOC_APPL_MODULE", "DAMOD_UID");
        AssertColumns(modules, new Dictionary<string, string>
        {
            ["DAMOD_UID"] = "NUMBER",
            ["DAMOD_DOC_CODE"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_APPL_FOR"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_PROD_CODE_FM"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_PROD_CODE_TO"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_PCM_CODE_FM"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_PCM_CODE_TO"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_CCM_CODE_FM"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_CCM_CODE_TO"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_DOC_MAND_YN"] = "VARCHAR2(1 BYTE)",
            ["DAMOD_ACTIVE_YN"] = "VARCHAR2(1 BYTE)",
            ["DAMOD_CR_BY"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_CR_DT"] = "DATE",
            ["DAMOD_UP_BY"] = "VARCHAR2(12 BYTE)",
            ["DAMOD_UP_DT"] = "DATE",
        });

        var identifier = FindProperty(modules, "DAMOD_UID");
        Assert.Equal(typeof(decimal), (Type)ReadProperty(identifier, "ClrType")!);
        Assert.Equal("NUMBER", ReadAnnotation(identifier, "Relational:ColumnType"));
        Assert.Empty(ReadEnumerable(modules, "GetForeignKeys"));
        Assert.Empty(ReadSequences(model));
    }

    private static IDisposable CreateContext()
    {
        var apiAssembly = Assembly.Load("SDD.API");
        var contextType = apiAssembly.GetType("SDD.API.Data.CodesMasterContext", throwOnError: true)!;
        var efCoreAssembly = Assembly.Load("Microsoft.EntityFrameworkCore");
        var optionsBuilderType = efCoreAssembly
            .GetType("Microsoft.EntityFrameworkCore.DbContextOptionsBuilder`1", throwOnError: true)!
            .MakeGenericType(contextType);
        var optionsBuilder = Activator.CreateInstance(optionsBuilderType)!;
        var providerAssembly = Assembly.Load("Oracle.EntityFrameworkCore");
        var useOracle = providerAssembly.GetTypes()
            .SelectMany(type => type.GetMethods(BindingFlags.Public | BindingFlags.Static))
            .First(method =>
                method.Name == "UseOracle" &&
                method.GetParameters().Length >= 2 &&
                method.GetParameters()[0].ParameterType.Name == "DbContextOptionsBuilder" &&
                method.GetParameters()[1].ParameterType == typeof(string));
        var arguments = useOracle.GetParameters()
            .Select(parameter => parameter.IsOptional ? Type.Missing : null)
            .ToArray();
        arguments[0] = optionsBuilder;
        arguments[1] = "User Id=test;Password=test;Data Source=localhost:1521/FREE";
        useOracle.Invoke(null, arguments);
        var optionsProperty = optionsBuilderType.GetProperties()
            .First(property => property.Name == "Options" && property.PropertyType.IsGenericType);
        var options = optionsProperty.GetValue(optionsBuilder)!;
        return (IDisposable)Activator.CreateInstance(contextType, options)!;
    }

    private static object AssertEntity(IEnumerable<object> entityTypes, string tableName, string keyName)
    {
        var entity = Assert.Single(entityTypes, item => ReadAnnotation(item, "Relational:TableName") as string == tableName);
        Assert.Equal("IIRIS_RD_DEVP", ReadAnnotation(entity, "Relational:Schema"));

        var primaryKey = Invoke(entity, "FindPrimaryKey")!;
        var keyProperties = ReadEnumerable(primaryKey, "get_Properties");
        Assert.Equal(keyName, ReadProperty(Assert.Single(keyProperties), "Name"));
        return entity;
    }

    private static void AssertColumns(object entity, IReadOnlyDictionary<string, string> expected)
    {
        var properties = ReadEnumerable(entity, "GetProperties");
        var actualColumns = properties.ToDictionary(
            property => (string?)ReadAnnotation(property, "Relational:ColumnName")
                ?? (string)ReadProperty(property, "Name")!,
            property => property);

        Assert.Equal(expected.Keys.Order(), actualColumns.Keys.Order());
        foreach (var (column, storeType) in expected)
        {
            var property = actualColumns[column];
            Assert.Equal(storeType, ReadAnnotation(property, "Relational:ColumnType"));
            var byteLimit = System.Text.RegularExpressions.Regex.Match(storeType, @"^VARCHAR2\((\d+) BYTE\)$");
            Assert.Equal(
                byteLimit.Success ? int.Parse(byteLimit.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture) : null,
                ReadAnnotation(property, "MaxLength"));
        }
    }

    private static object FindProperty(object entity, string name)
    {
        return Assert.Single(
            ReadEnumerable(entity, "GetProperties"),
            property => (string?)ReadProperty(property, "Name") == name);
    }

    private static object? ReadAnnotation(object target, string name)
    {
        var annotation = Invoke(target, "FindAnnotation", name);
        return annotation is null ? null : ReadProperty(annotation, "Value");
    }

    private static IEnumerable<object> ReadEnumerable(object target, string method)
    {
        var result = Invoke(target, method);
        return ((IEnumerable)result!).Cast<object>();
    }

    private static object? ReadProperty(object target, string name)
    {
        var property = target.GetType().GetProperties().FirstOrDefault(item => item.Name == name)
            ?? target.GetType().GetInterfaces().Select(type => type.GetProperty(name)).FirstOrDefault(item => item is not null);
        if (property is not null)
        {
            return property.GetValue(target);
        }

        var method = target.GetType().GetMethods().Concat(target.GetType().GetInterfaces().SelectMany(type => type.GetMethods()))
            .FirstOrDefault(item => item.Name == name && item.GetParameters().Length == 0);
        return method?.Invoke(target, null);
    }

    private static object? Invoke(object target, string methodName, params object?[] arguments)
    {
        var method = target.GetType().GetMethods()
            .Concat(target.GetType().GetInterfaces().SelectMany(type => type.GetMethods()))
            .FirstOrDefault(candidate =>
                candidate.Name == methodName &&
                candidate.GetParameters().Length == arguments.Length &&
                candidate.GetParameters().Select((parameter, index) =>
                    arguments[index] is null || parameter.ParameterType.IsInstanceOfType(arguments[index])).All(matches => matches));
        return method?.Invoke(target, arguments);
    }

    private static IEnumerable<object> ReadSequences(object model)
    {
        var relationalAssembly = Assembly.Load("Microsoft.EntityFrameworkCore.Relational");
        var method = relationalAssembly.GetTypes()
            .SelectMany(type => type.GetMethods(BindingFlags.Public | BindingFlags.Static))
            .FirstOrDefault(candidate =>
                candidate.Name == "GetSequences" &&
                candidate.GetParameters().Length == 1 &&
                candidate.GetParameters()[0].ParameterType.IsInstanceOfType(model));
        return method is null
            ? []
            : ((IEnumerable)method.Invoke(null, [model])!).Cast<object>();
    }
}
