using System.Text.Json;
using Microsoft.AspNetCore.Http;
using SDD.API.Contracts;

namespace SDD.API.Services;

public sealed class DocumentSetupValidator
{
    public IReadOnlyDictionary<string, string[]> Validate(DocumentSetupWriteRequest request)
    {
        var errors = new Dictionary<string, List<string>>();
        AddRequiredError(errors, nameof(request.DocCode), request.DocCode);
        AddRequiredError(errors, nameof(request.DocSetupFor), request.DocSetupFor);
        AddLengthError(errors, nameof(request.DocCode), request.DocCode, 12);
        AddLengthError(errors, nameof(request.DocName), request.DocName, 100);
        AddLengthError(errors, nameof(request.NameInArabic), request.NameInArabic, 100);
        AddLengthError(errors, nameof(request.DocDescription), request.DocDescription, 2000);
        AddLengthError(errors, nameof(request.DescriptionInArabic), request.DescriptionInArabic, 2000);
        AddLengthError(errors, nameof(request.DocSetupFor), request.DocSetupFor, 12);
        AddLengthError(errors, nameof(request.Flex1), request.Flex1, 60);
        AddLengthError(errors, nameof(request.Flex2), request.Flex2, 60);
        AddLengthError(errors, nameof(request.ActiveYn), request.ActiveYn, 1);

        if (!string.IsNullOrWhiteSpace(request.ActiveYn) &&
            request.ActiveYn is not ("Y" or "N"))
        {
            AddError(errors, nameof(request.ActiveYn), "Choose Y or N.");
        }

        return errors.ToDictionary(
            entry => JsonNamingPolicy.CamelCase.ConvertName(entry.Key),
            entry => entry.Value.ToArray());
    }

    public void EnsureValid(DocumentSetupWriteRequest request)
    {
        var errors = Validate(request);
        if (errors.Count > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The submitted document setup is not valid.",
                "Correct the highlighted fields and try again.",
                errors);
        }
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

        if (!OracleDatabaseEncoding.TryGetByteCount(value, out var byteCount))
        {
            AddError(errors, field, "This field contains characters not supported by the database.");
        }
        else if (byteCount > maximumBytes)
        {
            AddError(errors, field, $"This field cannot exceed {maximumBytes} bytes.");
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
