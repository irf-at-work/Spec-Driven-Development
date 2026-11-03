using System;
using System.Collections.Generic;

namespace SDD.API.Data.Scaffolded;

public partial class BrmVehModel
{
    public string VmodVmakCode { get; set; } = null!;

    public string VmodCode { get; set; } = null!;

    public string? VmodName { get; set; }

    public string? VmodShortName { get; set; }

    public string? VmodRemarks { get; set; }

    public string? VmodNameL2 { get; set; }

    public string? VmodShortNameL2 { get; set; }

    public string? VmodRemarksL2 { get; set; }

    public string? VmodVariant { get; set; }

    public string? VmodType { get; set; }

    public string? VmodWeight { get; set; }

    public string? VmodLoadCapacity { get; set; }

    public string? VmodBodyType { get; set; }

    public string? VmodFuelType { get; set; }

    public decimal? VmodCc { get; set; }

    public string? VmodCylinder { get; set; }

    public byte? VmodNoSeats { get; set; }

    public byte? VmodNoPass { get; set; }

    public byte? VmodNoDrvr { get; set; }

    public string? VmodDoors { get; set; }

    public decimal? VmodMakeYear { get; set; }

    public string? VmodDrivingType { get; set; }

    public string? VmodBodyColor { get; set; }

    public decimal? VmodValueLc { get; set; }

    public string? VmodActiveYn { get; set; }

    public string? VmodCrBy { get; set; }

    public DateTime? VmodCrDt { get; set; }

    public string? VmodUpBy { get; set; }

    public DateTime? VmodUpDt { get; set; }

    public string? VmodCatgCode { get; set; }

    public virtual BrmVehMake VmodVmakCodeNavigation { get; set; } = null!;
}
