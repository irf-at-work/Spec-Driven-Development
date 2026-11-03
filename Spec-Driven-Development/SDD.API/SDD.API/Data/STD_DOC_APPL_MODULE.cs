namespace SDD.API.Data;

public partial class STD_DOC_APPL_MODULE
{
    public decimal DAMOD_UID { get; set; }
    public string? DAMOD_DOC_CODE { get; set; }
    public string? DAMOD_APPL_FOR { get; set; }
    public string? DAMOD_PROD_CODE_FM { get; set; }
    public string? DAMOD_PROD_CODE_TO { get; set; }
    public string? DAMOD_PCM_CODE_FM { get; set; }
    public string? DAMOD_PCM_CODE_TO { get; set; }
    public string? DAMOD_CCM_CODE_FM { get; set; }
    public string? DAMOD_CCM_CODE_TO { get; set; }
    public string? DAMOD_DOC_MAND_YN { get; set; }
    public string? DAMOD_ACTIVE_YN { get; set; }
    public string? DAMOD_CR_BY { get; set; }
    public DateTime? DAMOD_CR_DT { get; set; }
    public string? DAMOD_UP_BY { get; set; }
    public DateTime? DAMOD_UP_DT { get; set; }
}
