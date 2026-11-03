using System.Text;

namespace SDD.API.Services;

internal static class OracleDatabaseEncoding
{
    private static readonly Encoding OracleEncoding = CreateEncoding();

    public static bool TryGetByteCount(string value, out int byteCount)
    {
        try
        {
            byteCount = OracleEncoding.GetByteCount(value);
            return true;
        }
        catch (EncoderFallbackException)
        {
            byteCount = 0;
            return false;
        }
    }

    private static Encoding CreateEncoding()
    {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        return Encoding.GetEncoding(
            1256,
            EncoderFallback.ExceptionFallback,
            DecoderFallback.ExceptionFallback);
    }
}
