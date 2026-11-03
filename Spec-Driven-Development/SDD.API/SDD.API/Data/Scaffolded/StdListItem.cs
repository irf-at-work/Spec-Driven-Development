using System;
using System.Collections.Generic;

namespace SDD.API.Data.Scaffolded;

public partial class StdListItem
{
    public string LiType { get; set; } = null!;

    public string LiCode { get; set; } = null!;

    public string? LiDesc { get; set; }

    public string? LiDescL2 { get; set; }

    public string? LiShortDesc { get; set; }

    public string? LiShortDescL2 { get; set; }

    public string? LiValue { get; set; }

    public string? LiActiveYn { get; set; }

    public string? LiCrBy { get; set; }

    public DateTime? LiCrDt { get; set; }

    public string? LiUpBy { get; set; }

    public DateTime? LiUpDt { get; set; }

    public string? LiFlex01 { get; set; }

    public string? LiFlex02 { get; set; }
}
