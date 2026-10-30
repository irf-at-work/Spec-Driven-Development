using System.Text;
using System.Text.Json;
using SDD.API.Contracts;

namespace SDD.API.Services;

public sealed class CodesFieldValidator
{
    private static readonly Encoding OracleEncoding = CreateOracleEncoding();

    public IReadOnlyDictionary<string, string[]> Validate(CodeWriteRequest request)
    {
        var errors = new Dictionary<string, List<string>>();

        AddRequiredError(errors, nameof(request.Code), request.Code);
        AddRequiredError(errors, nameof(request.CodeType), request.CodeType);
        AddLengthError(errors, nameof(request.Code), request.Code, 12);
        AddLengthError(errors, nameof(request.CodeType), request.CodeType, 20);
        AddLengthError(errors, nameof(request.CodeDescription), request.CodeDescription, 100);
        AddLengthError(errors, nameof(request.ShortDescription), request.ShortDescription, 30);
        AddLengthError(errors, nameof(request.LongDescription), request.LongDescription, 2000);
        AddLengthError(errors, nameof(request.Value1), request.Value1, 100);
        AddLengthError(errors, nameof(request.Value2), request.Value2, 100);
        AddLengthError(errors, nameof(request.Flex1), request.Flex1, 60);
        AddLengthError(errors, nameof(request.Flex2), request.Flex2, 2000);
        AddLengthError(errors, nameof(request.DescriptionInArabic), request.DescriptionInArabic, 100);
        AddLengthError(errors, nameof(request.ShortDescriptionInArabic), request.ShortDescriptionInArabic, 30);
        AddLengthError(errors, nameof(request.LongDescriptionInArabic), request.LongDescriptionInArabic, 2000);
        AddLengthError(errors, nameof(request.ActiveYn), request.ActiveYn, 1);

        return errors.ToDictionary(
            entry => JsonNamingPolicy.CamelCase.ConvertName(entry.Key),
            entry => entry.Value.ToArray());
    }

    public void EnsureValid(CodeWriteRequest request)
    {
        var errors = Validate(request);
        if (errors.Count > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The submitted code is not valid.",
                "Correct the highlighted fields and try again.",
                errors);
        }
    }

    private static Encoding CreateOracleEncoding()
    {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        return Encoding.GetEncoding(
            1256,
            EncoderFallback.ExceptionFallback,
            DecoderFallback.ExceptionFallback);
    }

    private static void AddRequiredError(
        IDictionary<string, List<string>> errors,
        string field,
        string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            AddError(errors, field, "This field is required.");
        }
    }

    private static void AddLengthError(
        IDictionary<string, List<string>> errors,
        string field,
        string? value,
        int maximumBytes)
    {
        if (value is null)
        {
            return;
        }

        try
        {
            if (OracleEncoding.GetByteCount(value) > maximumBytes)
            {
                AddError(errors, field, $"This field cannot exceed {maximumBytes} bytes.");
            }
        }
        catch (EncoderFallbackException)
        {
            AddError(errors, field, "This field contains characters not supported by the database.");
        }
    }

    private static void AddError(
        IDictionary<string, List<string>> errors,
        string field,
        string message)
    {
        if (!errors.TryGetValue(field, out var messages))
        {
            messages = [];
            errors[field] = messages;
        }

        messages.Add(message);
    }
}
