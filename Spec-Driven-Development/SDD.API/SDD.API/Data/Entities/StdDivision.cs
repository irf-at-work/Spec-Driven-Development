using System;
using System.Collections.Generic;

namespace SDD.API.Data.Entities;

public partial class StdDivision
{
    public string DivnCompCode { get; set; } = null!;

    public string DivnCode { get; set; } = null!;

    public string DivnName { get; set; } = null!;

    public string? DivnShortName { get; set; }

    public string? DivnNameL2 { get; set; }

    public string? DivnShortNameL2 { get; set; }

    public string? DivnAddr1 { get; set; }

    public string? DivnAddr2 { get; set; }

    public string? DivnAddr3 { get; set; }

    public string? DivnAddr1L2 { get; set; }

    public string? DivnAddr2L2 { get; set; }

    public string? DivnAddr3L2 { get; set; }

    public string? DivnCrNo { get; set; }

    public DateTime? DivnLicenseIssDt { get; set; }

    public DateTime? DivnLicenseExpDt { get; set; }

    public string? DivnIncharge { get; set; }

    public string? DivnInchargeL2 { get; set; }

    public string? DivnPhone { get; set; }

    public string? DivnFax { get; set; }

    public string? DivnMobile { get; set; }

    public string? DivnEmail { get; set; }

    public string? DivnRemarks { get; set; }

    public string? DivnActiveYn { get; set; }

    public string? DivnCrBy { get; set; }

    public DateTime? DivnCrDt { get; set; }

    public string? DivnUpBy { get; set; }

    public DateTime? DivnUpDt { get; set; }
}
