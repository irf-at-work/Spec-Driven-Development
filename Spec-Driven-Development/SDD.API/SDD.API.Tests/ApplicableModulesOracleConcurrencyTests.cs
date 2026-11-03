using System.Reflection;
using System.Text.Json;
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging.Abstractions;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Services;
using Xunit.Sdk;

namespace SDD.API.Tests;

public sealed class ApplicableModulesOracleConcurrencyTests
{
    private const string UserSecretsId = "19035b3a-e7e8-4b3f-b697-c5f9c37712aa";

    [Fact]
    public async Task Parent_delete_and_child_create_are_serialized_without_orphans()
    {
        var connectionString = GetConnectionString();
        if (connectionString is null)
        {
            throw SkipException.ForSkip("The existing CodesMasterOracle connection is not configured.");
        }

        await EnsureOracleConnectionIsAvailable(connectionString);
        var contexts = new List<IDisposable>();
        var docCode = $"T{Guid.NewGuid():N}"[..12];
        DocumentSetupRecord? parent = null;
        ApplicableModuleRecord? child = null;
        IDocumentSetupsRepository? parentRepository = null;
        ApplicableModulesService? childService = null;
        var parentDeleted = false;
        try
        {
            var parentContext = CreateContext(connectionString);
            contexts.Add(parentContext);
            parentRepository = CreateRepository<IDocumentSetupsRepository>(
                parentContext,
                "SDD.API.Services.DocumentSetupsRepository");
            var parentService = new DocumentSetupsService(
                parentRepository,
                new DocumentSetupValidator(),
                NullLogger<DocumentSetupsService>.Instance);
            parent = await parentService.CreateAsync(
                new DocumentSetupWriteRequest { DocCode = docCode, DocSetupFor = "101" },
                default);

            var childContext = CreateContext(connectionString);
            var deleteContext = CreateContext(connectionString);
            contexts.Add(childContext);
            contexts.Add(deleteContext);
            childService = new ApplicableModulesService(
                CreateRepository<IApplicableModulesRepository>(
                    childContext,
                    "SDD.API.Services.ApplicableModulesRepository"),
                new ApplicableModuleValidator(),
                NullLogger<ApplicableModulesService>.Instance);
            var deleteRepository = CreateRepository<IDocumentSetupsRepository>(
                deleteContext,
                "SDD.API.Services.DocumentSetupsRepository");
            var start = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);

            var createTask = Task.Run(async () =>
            {
                await start.Task;
                try
                {
                    return await childService.CreateAsync(
                        docCode,
                        new ApplicableModuleWriteRequest { ApplicableFor = "ASR" },
                        default);
                }
                catch (CodesApiException exception) when (exception.StatusCode == 404)
                {
                    return null;
                }
            });
            var deleteTask = Task.Run(async () =>
            {
                await start.Task;
                try
                {
                    return await deleteRepository.DeleteIfCurrentAndChildFreeAsync(
                        docCode,
                        parent.Version,
                        default);
                }
                catch (CodesApiException exception) when (exception.StatusCode == 409)
                {
                    return false;
                }
            });

            start.SetResult(true);
            child = await createTask;
            parentDeleted = await deleteTask;

            Assert.NotEqual(child is not null, parentDeleted);
            if (child is not null)
            {
                Assert.NotNull(await childService.GetAsync(
                    docCode,
                    decimal.Parse(child.DamodUid, System.Globalization.CultureInfo.InvariantCulture),
                    default));
            }
        }
        finally
        {
            if (child is not null && childService is not null)
            {
                await childService.DeleteAsync(
                    docCode,
                    decimal.Parse(child.DamodUid, System.Globalization.CultureInfo.InvariantCulture),
                    child.Version,
                    default);
            }

            if (!parentDeleted && parent is not null && parentRepository is not null)
            {
                await parentRepository.DeleteIfCurrentAndChildFreeAsync(docCode, parent.Version, default);
            }

            foreach (var context in contexts)
            {
                context.Dispose();
            }
        }
    }

    [Fact]
    public async Task Concurrent_creates_allocate_distinct_max_plus_one_ids()
    {
        var connectionString = GetConnectionString();
        if (connectionString is null)
        {
            throw SkipException.ForSkip("The existing CodesMasterOracle connection is not configured.");
        }

        await EnsureOracleConnectionIsAvailable(connectionString);

        var contexts = new List<IDisposable>();
        var createdModules = new ConcurrentDictionary<string, ApplicableModuleRecord>(StringComparer.Ordinal);
        var docCode = $"T{Guid.NewGuid():N}"[..12];
        DocumentSetupRecord? parent = null;
        IDocumentSetupsRepository? parentRepository = null;
        try
        {
            var parentContext = CreateContext(connectionString);
            contexts.Add(parentContext);
            parentRepository = CreateRepository<IDocumentSetupsRepository>(
                parentContext,
                "SDD.API.Services.DocumentSetupsRepository");
            var parentService = new DocumentSetupsService(
                parentRepository,
                new DocumentSetupValidator(),
                NullLogger<DocumentSetupsService>.Instance);
            var createdParent = await parentService.CreateAsync(
                new DocumentSetupWriteRequest
                {
                    DocCode = docCode,
                    DocSetupFor = "101",
                },
                default);
            parent = createdParent;
            parent = await parentService.UpdateAsync(
                docCode,
                new DocumentSetupUpdateRequest
                {
                    DocCode = docCode,
                    DocSetupFor = "102",
                    ExpectedVersion = createdParent.Version,
                },
                default);
            if (parent is null)
            {
                throw new InvalidOperationException("The created document setup could not be updated.");
            }

            var services = new List<ApplicableModulesService>();
            for (var index = 0; index < 4; index++)
            {
                var context = CreateContext(connectionString);
                contexts.Add(context);
                var repository = CreateRepository<IApplicableModulesRepository>(
                    context,
                    "SDD.API.Services.ApplicableModulesRepository");
                services.Add(new ApplicableModulesService(
                    repository,
                    new ApplicableModuleValidator(),
                    NullLogger<ApplicableModulesService>.Instance));
            }

            var results = await Task.WhenAll(services.Select(async service =>
            {
                var record = await service.CreateAsync(
                    docCode,
                    new ApplicableModuleWriteRequest { ApplicableFor = "ASR" },
                    default);
                createdModules.TryAdd(record.DamodUid, record);
                return record;
            }));

            Assert.Equal(services.Count, results.Select(record => record.DamodUid).Distinct().Count());
            Assert.Equal(
                services.Count,
                results.Select(record => decimal.Parse(record.DamodUid, System.Globalization.CultureInfo.InvariantCulture))
                    .Distinct()
                    .Count());

            var initialChild = results[0];
            var updatedChild = await services[0].UpdateAsync(
                docCode,
                decimal.Parse(initialChild.DamodUid, System.Globalization.CultureInfo.InvariantCulture),
                new ApplicableModuleUpdateRequest
                {
                    ApplicableFor = "ASSET",
                    ProductFrom = "1001",
                    ExpectedVersion = initialChild.Version,
                },
                default);
            Assert.NotNull(updatedChild);
            Assert.Equal(initialChild.DamodUid, updatedChild!.DamodUid);
            createdModules[updatedChild.DamodUid] = updatedChild;
        }
        finally
        {
            if (!createdModules.IsEmpty)
            {
                var cleanupContext = CreateContext(connectionString);
                contexts.Add(cleanupContext);
                var cleanupRepository = CreateRepository<IApplicableModulesRepository>(
                    cleanupContext,
                    "SDD.API.Services.ApplicableModulesRepository");
                var cleanupService = new ApplicableModulesService(
                    cleanupRepository,
                    new ApplicableModuleValidator(),
                    NullLogger<ApplicableModulesService>.Instance);

                foreach (var module in createdModules.Values)
                {
                    await cleanupService.DeleteAsync(docCode, decimal.Parse(
                        module.DamodUid,
                        System.Globalization.CultureInfo.InvariantCulture), module.Version, default);
                }
            }

            if (parent is not null && parentRepository is not null)
            {
                await parentRepository.DeleteIfCurrentAndChildFreeAsync(docCode, parent.Version, default);
            }

            foreach (var context in contexts)
            {
                context.Dispose();
            }
        }
    }

    private static string? GetConnectionString()
    {
        var environmentValue = Environment.GetEnvironmentVariable("ConnectionStrings__CodesMasterOracle");
        if (!string.IsNullOrWhiteSpace(environmentValue))
        {
            return environmentValue;
        }

        var secretsPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Microsoft",
            "UserSecrets",
            UserSecretsId,
            "secrets.json");
        if (!File.Exists(secretsPath))
        {
            return null;
        }

        using var secrets = JsonDocument.Parse(File.ReadAllText(secretsPath));
        var root = secrets.RootElement;
        if (root.TryGetProperty("ConnectionStrings:CodesMasterOracle", out var flattened) &&
            flattened.ValueKind == JsonValueKind.String)
        {
            return flattened.GetString();
        }

        return root.TryGetProperty("ConnectionStrings", out var connectionStrings) &&
               connectionStrings.TryGetProperty("CodesMasterOracle", out var nested) &&
               nested.ValueKind == JsonValueKind.String
            ? nested.GetString()
            : null;
    }

    private static async Task EnsureOracleConnectionIsAvailable(string connectionString)
    {
        await using var connection = new OracleConnection(connectionString);
        try
        {
            await connection.OpenAsync();
        }
        catch (OracleException)
        {
            throw SkipException.ForSkip("The existing CodesMasterOracle connection is unavailable.");
        }
    }

    private static IDisposable CreateContext(string connectionString)
    {
        var apiAssembly = Assembly.Load("SDD.API");
        var contextType = apiAssembly.GetType("SDD.API.Data.CodesMasterContext", throwOnError: true)!;
        var optionsBuilderType = Assembly.Load("Microsoft.EntityFrameworkCore")
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
        arguments[1] = connectionString;
        useOracle.Invoke(null, arguments);
        var options = optionsBuilderType.GetProperties()
            .First(property => property.Name == "Options" && property.PropertyType.IsGenericType)
            .GetValue(optionsBuilder)!;
        return (IDisposable)Activator.CreateInstance(contextType, options)!;
    }

    private static TRepository CreateRepository<TRepository>(IDisposable context, string repositoryTypeName)
        where TRepository : class
    {
        var repositoryType = Assembly.Load("SDD.API").GetType(repositoryTypeName, throwOnError: true)!;
        return (TRepository)Activator.CreateInstance(repositoryType, context)!;
    }
}
