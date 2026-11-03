using System;
using System.Collections.Generic;

namespace SDD.API.Data.Scaffolded;

public partial class BrmVehMake
{
    public string VmakCode { get; set; } = null!;

    public string? VmakName { get; set; }

    public string? VmakShortName { get; set; }

    public string? VmakRemarks { get; set; }

    public string? VmakNameL2 { get; set; }

    public string? VmakShortNameL2 { get; set; }

    public string? VmakRemarksL2 { get; set; }

    public string? VmakActiveYn { get; set; }

    public string? VmakCrBy { get; set; }

    public DateTime? VmakCrDt { get; set; }

    public string? VmakUpBy { get; set; }

    public DateTime? VmakUpDt { get; set; }

    public virtual ICollection<BrmVehModel> BrmVehModels { get; set; } = new List<BrmVehModel>();
}
