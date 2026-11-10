using SDD.API.Data.ClaimConfigurations;
using SDD.API.DTOs;

namespace SDD.API.Services;

public static class ClaimConfigurationMapping
{
    public static bool IsActive(string? flag) => flag != "N";

    public static bool IsYes(string? flag) => flag == "Y";

    public static ClaimConfigurationListItemDto ToListItem(BrmClmConfig row) => new(
        row.CcmCompCode,
        row.CcmCode,
        row.CcmName,
        row.CcmShortName ?? string.Empty,
        IsActive(row.CcmActiveYn));

    public static ClaimConfigurationDto ToDto(BrmClmConfig row) => new(
        row.CcmCompCode,
        row.CcmCode,
        row.CcmName,
        row.CcmShortName,
        row.CcmNameL2,
        row.CcmShortNameL2,
        row.CcmModule,
        row.CcmAcntPostingType,
        row.CcmAcntExchRateType,
        row.CcmRoundType,
        row.CcmRoundValue,
        row.CcmApplCurrType,
        row.CcmDfltEstCloReasonCode,
        row.CcmDfltRecvDeduCode,
        IsYes(row.CcmPrntBefApprYn),
        IsYes(row.CcmRePrntYn),
        IsYes(row.CcmClmAcntDocGenYn),
        IsYes(row.CcmClmCoinsAcntDocGenYn),
        IsActive(row.CcmActiveYn),
        row.CcmCrBy,
        row.CcmCrDt,
        row.CcmUpBy,
        row.CcmUpDt);
}
