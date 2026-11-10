using Microsoft.EntityFrameworkCore;
using SDD.API.Contracts;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed class ClaimConfigurationOptionsService(SddDbContext database)
{
    private static readonly IReadOnlyDictionary<string, string> ListTypes =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["module"] = "CCM_MODULE",
            ["postingType"] = "CCM_POST_TYPE",
            ["exchangeRateType"] = "CCM_EXCH_RATE",
            ["roundType"] = "CCM_ROUND_TYPE",
            ["applicableCurrencyType"] = "CCM_CURR_TYPE",
            ["estimatedClosureReason"] = "CCM_CLO_REASON",
            ["recoveryDeduction"] = "CCM_DFLT_RECV_DEDU"
        };

    public static bool IsSupportedField(string field) => ListTypes.ContainsKey(field);

    public async Task<bool> IsActiveChoiceAsync(string field, string code, CancellationToken cancellationToken)
    {
        if (!ListTypes.TryGetValue(field, out var type))
        {
            return false;
        }

        var count = await database.StdListItems.AsNoTracking()
            .Where(item => item.LiType == type && item.LiCode == code && item.LiActiveYn == "Y")
            .CountAsync(cancellationToken);
        return count > 0;
    }

    public async Task<PaginatedResult<LookupChoiceDto>> GetAsync(
        string field,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var type = ListTypes[field];
        var choices = database.StdListItems.AsNoTracking()
            .Where(item => item.LiType == type && item.LiActiveYn == "Y");
        var totalCount = await choices.CountAsync(cancellationToken);
        var skip = (int)Math.Min((long)(page - 1) * pageSize, int.MaxValue);
        var rows = await choices
            .OrderBy(item => item.LiDesc)
            .ThenBy(item => item.LiCode)
            .Skip(skip)
            .Take(pageSize)
            .Select(item => new LookupChoiceDto(item.LiCode, item.LiDesc ?? item.LiCode))
            .ToListAsync(cancellationToken);

        return new PaginatedResult<LookupChoiceDto>(rows, page, pageSize, totalCount);
    }
}
