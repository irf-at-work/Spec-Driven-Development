using System;
using System.Collections.Generic;

namespace SDD.API.Data;

public partial class STD_CODES
{
    public string CC_CODE { get; set; } = null!;

    public string CC_TYPE { get; set; } = null!;

    public string CC_COMP_CODE { get; set; } = null!;

    public string? CC_DESC { get; set; }

    public string? CC_SHORT_DESC { get; set; }

    public string? CC_LONG_DESC { get; set; }

    public string? CC_DESC_L2 { get; set; }

    public string? CC_SHORT_DESC_L2 { get; set; }

    public string? CC_LONG_DESC_L2 { get; set; }

    public string? CC_VALUE1 { get; set; }

    public string? CC_VALUE2 { get; set; }

    public string? CC_FLEX_01 { get; set; }

    public string? CC_FLEX_02 { get; set; }

    public string? CC_ACTIVE_YN { get; set; }

    public string? CC_CR_BY { get; set; }

    public DateTime? CC_CR_DT { get; set; }

    public string? CC_UP_BY { get; set; }

    public DateTime? CC_UP_DT { get; set; }
}
