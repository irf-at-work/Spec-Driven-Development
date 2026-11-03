namespace SDD.API.Data;

public partial class STD_DOCUMENT
{
    public string DOC_CODE { get; set; } = null!;
    public string? DOC_NAME { get; set; }
    public string? DOC_NAME_L2 { get; set; }
    public string? DOC_DESC { get; set; }
    public string? DOC_DESC_L2 { get; set; }
    public string? DOC_SETUP_FOR { get; set; }
    public string? DOC_ACTIVE_YN { get; set; }
    public string? DOC_FLEX_01 { get; set; }
    public string? DOC_FLEX_02 { get; set; }
    public string? DOC_CR_BY { get; set; }
    public DateTime? DOC_CR_DT { get; set; }
    public string? DOC_UP_BY { get; set; }
    public DateTime? DOC_UP_DT { get; set; }
}
