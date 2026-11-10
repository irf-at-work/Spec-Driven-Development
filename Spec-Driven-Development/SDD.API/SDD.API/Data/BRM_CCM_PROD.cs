namespace SDD.API.Data;

public sealed class BRM_CCM_PROD
{
    public string CCMP_CCM_CODE { get; set; } = null!;
    public string CCMP_CODE { get; set; } = null!;
    public string? CCMP_CR_BY { get; set; }
    public DateTime? CCMP_CR_DT { get; set; }
    public string? CCMP_UP_BY { get; set; }
    public DateTime? CCMP_UP_DT { get; set; }
}