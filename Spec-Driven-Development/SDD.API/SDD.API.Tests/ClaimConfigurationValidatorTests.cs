using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class ClaimConfigurationValidatorTests
{
    [Fact]
    public void Validate_requires_only_code_and_name()
    {
        var errors = new ClaimConfigurationValidator().Validate(new ClaimConfigurationWrite());

        Assert.Contains("ccmCode", errors.Keys);
        Assert.Contains("ccmName", errors.Keys);
        Assert.Equal(2, errors.Count);
        Assert.DoesNotContain("ccmShortName", errors.Keys);
        Assert.DoesNotContain("nameInArabic", errors.Keys);
        Assert.DoesNotContain("shortNameInArabic", errors.Keys);
        Assert.DoesNotContain("module", errors.Keys);
        Assert.DoesNotContain("postingType", errors.Keys);
        Assert.DoesNotContain("exchangeRateType", errors.Keys);
        Assert.DoesNotContain("roundingType", errors.Keys);
        Assert.DoesNotContain("applicableCurrencies", errors.Keys);
        Assert.DoesNotContain("defaultEstimateCloseReasonCode", errors.Keys);
        Assert.DoesNotContain("defaultRecoveryCodeForDedl", errors.Keys);
    }

    [Theory]
    [InlineData(-999.99999)]
    [InlineData(0)]
    [InlineData(999.99999)]
    public void Validate_accepts_rounding_values_in_number_eight_five_range(decimal value)
    {
        var errors = new ClaimConfigurationValidator().Validate(ValidRequest() with { RoundingValue = value });

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData(-1000)]
    [InlineData(1000)]
    [InlineData(1.000001)]
    public void Validate_rejects_rounding_values_outside_number_eight_five(decimal value)
    {
        var errors = new ClaimConfigurationValidator().Validate(ValidRequest() with { RoundingValue = value });

        Assert.Contains("roundingValue", errors.Keys);
    }

    [Fact]
    public void Validate_rejects_toggle_values_other_than_y_or_n()
    {
        var errors = new ClaimConfigurationValidator().Validate(
            ValidRequest() with { ActiveYn = "true", PrintBeforeApprovalYn = "X" });

        Assert.Contains("activeYn", errors.Keys);
        Assert.Contains("printBeforeApprovalYn", errors.Keys);
    }

    private static ClaimConfigurationWrite ValidRequest() =>
        new()
        {
            CcmCode = "CCM-A",
            CcmName = "Example",
            CcmShortName = "Ex",
            NameInArabic = "Example",
            ShortNameInArabic = "Ex",
            Module = "01",
            PostingType = "1",
            ExchangeRateType = "1",
            RoundingType = "01",
            ApplicableCurrencies = "01",
            DefaultEstimateCloseReasonCode = "01",
            DefaultRecoveryCodeForDedl = "01",
            PrintBeforeApprovalYn = "N",
            RePrintAllowedYn = "N",
            ClaimAccountDocumentGenerationYn = "N",
            SharingClaimsAccountDocumentGenerationYn = "N",
            ActiveYn = "Y"
        };
}
