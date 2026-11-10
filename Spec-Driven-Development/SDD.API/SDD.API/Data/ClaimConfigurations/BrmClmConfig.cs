namespace SDD.API.Data.ClaimConfigurations;

/// <summary>Application-owned mapping for the existing BRM_CLM_CONFIG table.</summary>
public sealed class BrmClmConfig
{
    public string CcmCompCode { get; set; } = null!;
    public string CcmCode { get; set; } = null!;
    public string CcmName { get; set; } = null!;
    public string? CcmShortName { get; set; }
    public string? CcmNameL2 { get; set; }
    public string? CcmShortNameL2 { get; set; }
    public string? CcmModule { get; set; }
    public string? CcmAcntPostingType { get; set; }
    public string? CcmAcntExchRateType { get; set; }
    public string? CcmRoundType { get; set; }
    public decimal? CcmRoundValue { get; set; }
    public string? CcmApplCurrType { get; set; }
    public string? CcmDfltEstCloReasonCode { get; set; }
    public string? CcmDfltRecvDeduCode { get; set; }
    public string? CcmPrntBefApprYn { get; set; }
    public string? CcmRePrntYn { get; set; }
    public string? CcmClmAcntDocGenYn { get; set; }
    public string? CcmClmCoinsAcntDocGenYn { get; set; }
    public string? CcmActiveYn { get; set; }
    public string? CcmCrBy { get; set; }
    public DateTime? CcmCrDt { get; set; }
    public string? CcmUpBy { get; set; }
    public DateTime? CcmUpDt { get; set; }
}
