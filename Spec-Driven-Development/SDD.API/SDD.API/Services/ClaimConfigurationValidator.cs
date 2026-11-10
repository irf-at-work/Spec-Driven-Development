using System.Text.Json;
using Microsoft.AspNetCore.Http;
using SDD.API.Contracts;

namespace SDD.API.Services;

public sealed class ClaimConfigurationValidator
{
    public IReadOnlyDictionary<string, string[]> Validate(ClaimConfigurationWrite request)
    {
        var errors = new Dictionary<string, List<string>>();
        AddRequiredError(errors, nameof(request.CcmCode), request.CcmCode);
        AddRequiredError(errors, nameof(request.CcmName), request.CcmName);

        var toggleFields = new (string Field, string? Value)[]
        {
            (nameof(request.PrintBeforeApprovalYn), request.PrintBeforeApprovalYn),
            (nameof(request.RePrintAllowedYn), request.RePrintAllowedYn),
            (nameof(request.ClaimAccountDocumentGenerationYn), request.ClaimAccountDocumentGenerationYn),
            (nameof(request.SharingClaimsAccountDocumentGenerationYn), request.SharingClaimsAccountDocumentGenerationYn),
            (nameof(request.ActiveYn), request.ActiveYn)
        };
        foreach (var (field, toggleValue) in toggleFields)
        {
            if (toggleValue is not null && toggleValue is not ("Y" or "N"))
            {
                AddError(errors, field, "Choose Y or N.");
            }
        }

        if (request.RoundingValue is decimal roundingValue &&
            (roundingValue < -999.99999m || roundingValue > 999.99999m ||
             decimal.Round(roundingValue, 5) != roundingValue))
        {
            AddError(
                errors,
                nameof(request.RoundingValue),
                "Enter a number no greater than 999.99999 in magnitude and with at most five fractional digits.");
        }

        return errors.ToDictionary(
            entry => JsonNamingPolicy.CamelCase.ConvertName(entry.Key),
            entry => entry.Value.ToArray());
    }

    public void EnsureValid(ClaimConfigurationWrite request)
    {
        var errors = Validate(request);
        if (errors.Count > 0)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The submitted claim configuration is not valid.",
                "Correct the highlighted fields and try again.",
                errors);
        }
    }

    public void EnsureProductValid(ApplicableProductWrite request)
    {
        if (!string.IsNullOrWhiteSpace(request.ProductCode))
        {
            return;
        }

        throw new CodesApiException(
            StatusCodes.Status400BadRequest,
            "The submitted product mapping is not valid.",
            "Choose a Product Code.",
            new Dictionary<string, string[]>
            {
                ["productCode"] = ["Product Code is required."]
            });
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