using System.Security.Cryptography;
using System.Text.Json;
using SDD.API.Data;

namespace SDD.API.Services;

public static class ClaimConfigurationVersion
{
    public static string Create(BRM_CLM_CONFIG record) =>
        CreateToken(
            record.CCM_COMP_CODE,
            record.CCM_CODE,
            record.CCM_NAME,
            record.CCM_SHORT_NAME,
            record.CCM_NAME_L2,
            record.CCM_SHORT_NAME_L2,
            record.CCM_MODULE,
            record.CCM_ACNT_POSTING_TYPE,
            record.CCM_ACNT_EXCH_RATE_TYPE,
            record.CCM_ROUND_TYPE,
            record.CCM_ROUND_VALUE?.ToString("G29", System.Globalization.CultureInfo.InvariantCulture),
            record.CCM_APPL_CURR_TYPE,
            record.CCM_DFLT_EST_CLO_REASON_CODE,
            record.CCM_DFLT_RECV_DEDU_CODE,
            record.CCM_PRNT_BEF_APPR_YN,
            record.CCM_RE_PRNT_YN,
            record.CCM_CLM_ACNT_DOC_GEN_YN,
            record.CCM_CLM_COINS_ACNT_DOC_GEN_YN,
            record.CCM_ACTIVE_YN,
            record.CCM_CR_BY,
            record.CCM_CR_DT?.ToString("O", System.Globalization.CultureInfo.InvariantCulture),
            record.CCM_UP_BY,
            record.CCM_UP_DT?.ToString("O", System.Globalization.CultureInfo.InvariantCulture));

    public static string Create(BRM_CCM_PROD record) =>
        CreateToken(
            record.CCMP_CCM_CODE,
            record.CCMP_CODE,
            record.CCMP_CR_BY,
            record.CCMP_CR_DT?.ToString("O", System.Globalization.CultureInfo.InvariantCulture),
            record.CCMP_UP_BY,
            record.CCMP_UP_DT?.ToString("O", System.Globalization.CultureInfo.InvariantCulture));

    private static string CreateToken(params string?[] values)
    {
        var snapshot = JsonSerializer.SerializeToUtf8Bytes(values);
        return Convert.ToBase64String(SHA256.HashData(snapshot))
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }
}
