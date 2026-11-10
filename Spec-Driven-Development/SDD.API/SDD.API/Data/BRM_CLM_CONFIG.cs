namespace SDD.API.Data;

public sealed class BRM_CLM_CONFIG
{
    public string CCM_COMP_CODE { get; set; } = null!;
    public string CCM_CODE { get; set; } = null!;
    public string CCM_NAME { get; set; } = null!;
    public string? CCM_SHORT_NAME { get; set; }
    public string? CCM_NAME_L2 { get; set; }
    public string? CCM_SHORT_NAME_L2 { get; set; }
    public string? CCM_MODULE { get; set; }
    public string? CCM_ACNT_POSTING_TYPE { get; set; }
    public string? CCM_ACNT_EXCH_RATE_TYPE { get; set; }
    public string? CCM_ROUND_TYPE { get; set; }
    public decimal? CCM_ROUND_VALUE { get; set; }
    public string? CCM_APPL_CURR_TYPE { get; set; }
    public string? CCM_DFLT_EST_CLO_REASON_CODE { get; set; }
    public string? CCM_DFLT_RECV_DEDU_CODE { get; set; }
    public string? CCM_PRNT_BEF_APPR_YN { get; set; }
    public string? CCM_RE_PRNT_YN { get; set; }
    public string? CCM_CLM_ACNT_DOC_GEN_YN { get; set; }
    public string? CCM_CLM_COINS_ACNT_DOC_GEN_YN { get; set; }
    public string? CCM_ACTIVE_YN { get; set; }
    public string? CCM_CR_BY { get; set; }
    public DateTime? CCM_CR_DT { get; set; }
    public string? CCM_UP_BY { get; set; }
    public DateTime? CCM_UP_DT { get; set; }
}