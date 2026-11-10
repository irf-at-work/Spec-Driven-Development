namespace SDD.API.Data.ClaimConfigurations;

/// <summary>Application-owned mapping for the existing BRM_CCM_PROD table.</summary>
public sealed class BrmCcmProd
{
    public string CcmpCcmCode { get; set; } = null!;
    public string CcmpCode { get; set; } = null!;
    public string? CcmpCrBy { get; set; }
    public DateTime? CcmpCrDt { get; set; }
    public string? CcmpUpBy { get; set; }
    public DateTime? CcmpUpDt { get; set; }
}
