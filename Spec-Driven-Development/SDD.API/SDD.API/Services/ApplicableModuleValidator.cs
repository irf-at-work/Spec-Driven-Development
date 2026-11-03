using System.Text.Json;
using Microsoft.AspNetCore.Http;
using SDD.API.Contracts;

namespace SDD.API.Services;

public sealed class ApplicableModuleValidator
{
    public IReadOnlyDictionary<string, string[]> Validate(ApplicableModuleWriteRequest request)
    {
        var errors = new Dictionary<string, List<string>>();
        if (string.IsNullOrWhiteSpace(request.ApplicableFor))
        {
            AddError(errors, nameof(request.ApplicableFor), "This field is required.");
        }

        AddLengthError(errors, nameof(request.ApplicableFor), request.ApplicableFor, 12);
        AddLengthError(errors, nameof(request.ProductFrom), request.ProductFrom, 12);
        AddLengthError(errors, nameof(request.ProductTo), request.ProductTo, 12);
        AddLengthError(errors, nameof(request.PcmFrom), request.PcmFrom, 12);
        AddLengthError(errors, nameof(request.PcmTo), request.PcmTo, 12);
        AddLengthError(errors, nameof(request.CcmFrom), request.CcmFrom, 12);
        AddLengthError(errors, nameof(request.CcmTo), request.CcmTo, 12);
        AddYesNoError(errors, nameof(request.MandatoryYn), request.MandatoryYn);
        AddYesNoError(errors, nameof(request.ActiveYn), request.ActiveYn);

        return errors.ToDictionary(
            entry => JsonNamingPolicy.CamelCase.ConvertName(entry.Key),
            entry => entry.Value.ToArray());
    }

    public void EnsureValid(ApplicableModuleWriteRequest request)
    {
        var errors = Validate(request);
        if (errors.Count > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The submitted Applicable Module is not valid.",
                "Correct the highlighted fields and try again.",
                errors);
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

    private static void AddYesNoError(
        IDictionary<string, List<string>> errors,
        string field,
        string? value)
    {
        if (value is not null && value is not ("Y" or "N"))
        {
            AddError(errors, field, "Choose Y or N.");
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
