using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;
using SDD.API.Data;

namespace SDD.API.Services;

public static class DocumentSetupVersion
{
    public static string Create(STD_DOCUMENT document)
    {
        ArgumentNullException.ThrowIfNull(document);
        return CreateToken(
            document.DOC_CODE,
            document.DOC_NAME,
            document.DOC_NAME_L2,
            document.DOC_DESC,
            document.DOC_DESC_L2,
            document.DOC_SETUP_FOR,
            document.DOC_ACTIVE_YN,
            document.DOC_FLEX_01,
            document.DOC_FLEX_02,
            document.DOC_CR_BY,
            FormatDate(document.DOC_CR_DT),
            document.DOC_UP_BY,
            FormatDate(document.DOC_UP_DT));
    }

    public static string Create(STD_DOC_APPL_MODULE module)
    {
        ArgumentNullException.ThrowIfNull(module);
        return CreateToken(
            module.DAMOD_UID.ToString("G29", CultureInfo.InvariantCulture),
            module.DAMOD_DOC_CODE,
            module.DAMOD_APPL_FOR,
            module.DAMOD_PROD_CODE_FM,
            module.DAMOD_PROD_CODE_TO,
            module.DAMOD_PCM_CODE_FM,
            module.DAMOD_PCM_CODE_TO,
            module.DAMOD_CCM_CODE_FM,
            module.DAMOD_CCM_CODE_TO,
            module.DAMOD_DOC_MAND_YN,
            module.DAMOD_ACTIVE_YN,
            module.DAMOD_CR_BY,
            FormatDate(module.DAMOD_CR_DT),
            module.DAMOD_UP_BY,
            FormatDate(module.DAMOD_UP_DT));
    }

    private static string? FormatDate(DateTime? value)
    {
        return value?.ToString("O", CultureInfo.InvariantCulture);
    }

    private static string CreateToken(params string?[] values)
    {
        var snapshot = JsonSerializer.SerializeToUtf8Bytes(values);
        var hash = SHA256.HashData(snapshot);
        return Convert.ToBase64String(hash)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }
}
