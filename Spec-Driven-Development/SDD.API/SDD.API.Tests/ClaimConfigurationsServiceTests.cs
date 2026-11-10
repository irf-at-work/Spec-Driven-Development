using System.Reflection;
using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class ClaimConfigurationsServiceTests
{
    [Theory]
    [InlineData("CCM_DFLT_RECV_DEDU")]
    [InlineData("CCM_PRODUCT")]
    public async Task GetLookupsAsync_accepts_recovery_and_product_lookup_types(string liType)
    {
        var repository = DispatchProxy.Create<IClaimConfigurationsRepository, LookupRepositoryProxy>();
        var repositoryProxy = (LookupRepositoryProxy)(object)repository;
        var expected = new[]
        {
            new ClaimConfigurationLookupOption("01", "Option")
        };
        repositoryProxy.Options = expected;

        var service = new ClaimConfigurationsService(
            repository,
            new ClaimConfigurationValidator(),
            null!,
            NullLogger<ClaimConfigurationsService>.Instance);

        var result = await service.GetLookupsAsync(liType, CancellationToken.None);

        Assert.Equal(expected, result);
        Assert.Equal(liType, repositoryProxy.RequestedLookupType);
    }

    public class LookupRepositoryProxy : DispatchProxy
    {
        public IReadOnlyList<ClaimConfigurationLookupOption> Options { get; set; } = [];
        public string? RequestedLookupType { get; private set; }

        protected override object Invoke(MethodInfo? targetMethod, object?[]? args)
        {
            if (targetMethod?.Name != nameof(IClaimConfigurationsRepository.GetActiveLookupsAsync))
            {
                throw new NotSupportedException($"Unexpected repository call: {targetMethod?.Name}");
            }

            RequestedLookupType = (string)args![0]!;
            return Task.FromResult(Options);
        }
    }
}