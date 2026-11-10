using System.ComponentModel.DataAnnotations;

namespace SDD.API.Configuration;

/// <summary>
/// Company context for CCM records until sign-in supplies the user's company.
/// </summary>
public sealed class ClaimConfigurationOptions
{
    public const string SectionName = "ClaimConfiguration";

    /// <summary>The required company code used by the current no-login test environment.</summary>
    [Required]
    [MaxLength(12)]
    public string CompanyCode { get; init; } = string.Empty;
}
