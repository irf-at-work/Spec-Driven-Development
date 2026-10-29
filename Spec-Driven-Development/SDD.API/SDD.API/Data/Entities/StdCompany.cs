using System;
using System.Collections.Generic;

namespace SDD.API.Data.Entities;

public partial class StdCompany
{
    public string CompCode { get; set; } = null!;

    public string CompName { get; set; } = null!;

    public string? CompShortName { get; set; }

    public string? CompNameL2 { get; set; }

    public string? CompShortNameL2 { get; set; }

    public string? CompCtlAcntCode { get; set; }

    public string? CompAddr1 { get; set; }

    public string? CompAddr2 { get; set; }

    public string? CompAddr3 { get; set; }

    public string? CompAddr1L2 { get; set; }

    public string? CompAddr2L2 { get; set; }

    public string? CompAddr3L2 { get; set; }

    public DateTime? CompIncorpDt { get; set; }

    public string? CompCrNo { get; set; }

    public string? CompRefNo { get; set; }

    public DateTime? CompLicenseIssDt { get; set; }

    public DateTime? CompLicenseExpDt { get; set; }

    public string? CompIncharge { get; set; }

    public string? CompInchargeL2 { get; set; }

    public string? CompPhone { get; set; }

    public string? CompFax { get; set; }

    public string? CompMobile { get; set; }

    public string? CompEmail { get; set; }

    public string? CompWebsite { get; set; }

    public string? CompRemarks { get; set; }

    public string? CompActiveYn { get; set; }

    public string? CompCrBy { get; set; }

    public DateTime? CompCrDt { get; set; }

    public string? CompUpBy { get; set; }

    public DateTime? CompUpDt { get; set; }

    public string? CompVatRegnNo { get; set; }

    public string? CompVatLocation { get; set; }

    public DateTime? CompVatEffDt { get; set; }

    public DateTime? CompVatExpDt { get; set; }

    public string? CompBaseCurrCode { get; set; }

    public string? CompIaRegId { get; set; }

    public string? CompAmlRegId { get; set; }
}
