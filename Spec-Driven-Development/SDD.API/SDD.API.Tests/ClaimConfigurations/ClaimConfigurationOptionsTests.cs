using System.ComponentModel.DataAnnotations;
using SDD.API.Configuration;

namespace SDD.API.Tests.ClaimConfigurations;

public sealed class ClaimConfigurationOptionsTests
{
    [Fact]
    public void Configured_company_code_is_required_and_accepts_ASRTEST()
    {
        var options = new ClaimConfigurationOptions { CompanyCode = "ASRTEST" };
        var validationResults = new List<ValidationResult>();

        var isValid = Validator.TryValidateObject(
            options,
            new ValidationContext(options),
            validationResults,
            validateAllProperties: true);

        Assert.True(isValid);
        Assert.Empty(validationResults);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("1234567890123")]
    public void Missing_or_overlength_company_code_is_rejected(string companyCode)
    {
        var options = new ClaimConfigurationOptions { CompanyCode = companyCode };
        var validationResults = new List<ValidationResult>();

        var isValid = Validator.TryValidateObject(
            options,
            new ValidationContext(options),
            validationResults,
            validateAllProperties: true);

        Assert.False(isValid);
        Assert.NotEmpty(validationResults);
    }
}
