using System;
using System.Collections.Generic;

namespace SDD.API.Data.Scaffolded;

public partial class BrmMiscCode
{
    public string McType { get; set; } = null!;

    public string McCode { get; set; } = null!;

    public string McCompCode { get; set; } = null!;

    public string? McDesc { get; set; }

    public string? McShortDesc { get; set; }

    public string? McLongDesc { get; set; }

    public string? McDescL2 { get; set; }

    public string? McShortDescL2 { get; set; }

    public string? McLongDescL2 { get; set; }

    public string? McDiscType { get; set; }

    public string? McChgType { get; set; }

    public string? McChgCateg { get; set; }

    public string? McFlex01 { get; set; }

    public string? McActiveYn { get; set; }

    public string? McCrBy { get; set; }

    public DateTime? McCrDt { get; set; }

    public string? McUpBy { get; set; }

    public DateTime? McUpDt { get; set; }
}
