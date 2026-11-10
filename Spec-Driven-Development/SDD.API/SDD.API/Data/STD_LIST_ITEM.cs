namespace SDD.API.Data;

public sealed class STD_LIST_ITEM
{
    public string LI_TYPE { get; set; } = null!;
    public string LI_CODE { get; set; } = null!;
    public string? LI_DESC { get; set; }
    public string? LI_DESC_L2 { get; set; }
    public string? LI_SHORT_DESC { get; set; }
    public string? LI_SHORT_DESC_L2 { get; set; }
    public string? LI_VALUE { get; set; }
    public string? LI_ACTIVE_YN { get; set; }
    public string? LI_CR_BY { get; set; }
    public DateTime? LI_CR_DT { get; set; }
    public string? LI_UP_BY { get; set; }
    public DateTime? LI_UP_DT { get; set; }
    public string? LI_FLEX_01 { get; set; }
    public string? LI_FLEX_02 { get; set; }
}