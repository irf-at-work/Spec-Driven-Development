using System;
using System.Collections.Generic;

namespace SDD.API.Data.Entities;

public partial class StdDepartment
{
    public string DeptCompCode { get; set; } = null!;

    public string DeptDivnCode { get; set; } = null!;

    public string DeptCode { get; set; } = null!;

    public string DeptName { get; set; } = null!;

    public string? DeptShortName { get; set; }

    public string? DeptNameL2 { get; set; }

    public string? DeptShortNameL2 { get; set; }

    public string? DeptIncharge { get; set; }

    public string? DeptInchargeL2 { get; set; }

    public string? DeptRemarks { get; set; }

    public string? DeptActiveYn { get; set; }

    public string? DeptCrBy { get; set; }

    public DateTime? DeptCrDt { get; set; }

    public string? DeptUpBy { get; set; }

    public DateTime? DeptUpDt { get; set; }
}
