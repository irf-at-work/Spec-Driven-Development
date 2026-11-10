using System.Globalization;
using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationInputRulesTests
{
    [Fact]
    public void Create_defaults_a_missing_rounding_value_to_zero()
    {
        var values = ClaimConfigurationInputRules.Normalise(CreateRequest(roundingValue: null));

        Assert.Equal(0.00000m, values.RoundingValue);
        Assert.DoesNotContain("roundingValue", ClaimConfigurationInputRules.Validate(values).Keys);
    }

    [Theory]
    [InlineData("-1")]
    [InlineData("-0.00001")]
    public void Negative_rounding_values_are_rejected(string input)
    {
        var values = ClaimConfigurationInputRules.Normalise(
            CreateRequest(decimal.Parse(input, CultureInfo.InvariantCulture)));

        var errors = ClaimConfigurationInputRules.Validate(values);

        Assert.Contains("roundingValue", errors.Keys);
        Assert.Equal("Rounding Value cannot be negative.", errors["roundingValue"][0]);
    }

    [Theory]
    [InlineData("0")]
    [InlineData("2.000")]
    [InlineData("999.99999")]
    public void Non_negative_rounding_values_within_storage_capacity_are_accepted(string input)
    {
        var values = ClaimConfigurationInputRules.Normalise(
            CreateRequest(decimal.Parse(input, CultureInfo.InvariantCulture)));

        Assert.DoesNotContain("roundingValue", ClaimConfigurationInputRules.Validate(values).Keys);
    }

    private static CreateClaimConfigurationRequest CreateRequest(decimal? roundingValue) => new(
        "CCM001",
        "CLAIM CONFIG",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        roundingValue,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
}
