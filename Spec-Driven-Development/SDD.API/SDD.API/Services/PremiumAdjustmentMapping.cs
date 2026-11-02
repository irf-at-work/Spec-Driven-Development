using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public static class PremiumAdjustmentMapping
{
    public static bool IsActive(string? flag) => flag != "N";

    public static string ToFlag(bool active) => active ? "Y" : "N";

    public static AdjustmentCodeDto ToDto(PremiumAdjustmentListRow row)
    {
        return ToDto(row.Code, row.CodeTypeDescription);
    }

    public static AdjustmentCodeDto ToDto(BrmMiscCode code, string codeTypeDescription)
    {
        return new AdjustmentCodeDto(
            code.McType,
            codeTypeDescription,
            code.McCode,
            code.McCompCode,
            code.McDesc ?? string.Empty,
            code.McShortDesc ?? string.Empty,
            code.McDiscType,
            code.McChgType,
            code.McChgCateg,
            code.McLongDesc,
            code.McDescL2,
            code.McShortDescL2,
            code.McLongDescL2,
            IsActive(code.McActiveYn),
            code.McCrBy,
            code.McUpBy);
    }
}
