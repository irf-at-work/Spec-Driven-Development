using System.Text;
using SDD.API.DTOs;

namespace SDD.API.Services;

/// <summary>The cleaned-up values of a vehicle make, ready to be validated and saved.</summary>
public sealed record VehicleMakeValues(
    string MakeCode,
    string MakeName,
    string ShortName,
    string? Remarks,
    string? ArabicMakeName,
    string? ArabicShortName,
    string? ArabicRemarks,
    bool? Active = null);

/// <summary>
/// The single home of the Vehicle Make text rules (FR-004 to FR-008, FR-015): cleaning up what the user typed,
/// then checking it. The API is the authority; the Angular form only helps the user earlier.
/// </summary>
public static class VehicleMakeInputRules
{
    public const int MakeCodeMaxLength = 12;
    public const int MakeNameMaxLength = 100;
    public const int ShortNameMaxLength = 30;
    public const int RemarksMaxLength = 2000;
    public const int ArabicMakeNameMaxLength = 100;
    public const int ArabicShortNameMaxLength = 30;
    public const int ArabicRemarksMaxLength = 2000;

    public static VehicleMakeValues Normalise(CreateVehicleMakeRequest request) =>
        new(
            NormaliseMakeCode(request.MakeCode),
            NormaliseEnglishName(request.MakeName),
            NormaliseEnglishName(request.ShortName),
            NormaliseOptionalEnglishText(request.Remarks),
            KeepArabicExactly(request.ArabicMakeName),
            KeepArabicExactly(request.ArabicShortName),
            KeepArabicExactly(request.ArabicRemarks),
            request.Active);

    // The code comes from the web address, not the request body, because it can never be changed.
    public static VehicleMakeValues Normalise(string makeCode, UpdateVehicleMakeRequest request) =>
        new(
            NormaliseMakeCode(makeCode),
            NormaliseEnglishName(request.MakeName),
            NormaliseEnglishName(request.ShortName),
            NormaliseOptionalEnglishText(request.Remarks),
            KeepArabicExactly(request.ArabicMakeName),
            KeepArabicExactly(request.ArabicShortName),
            KeepArabicExactly(request.ArabicRemarks),
            request.Active);

    public static string NormaliseMakeCode(string? makeCode) =>
        (makeCode ?? string.Empty).Trim().ToUpperInvariant();

    /// <summary>
    /// Returns field errors keyed by the JSON field name (camelCase); an empty result means the values are valid.
    /// The code is only checked when creating, because on update it is not editable.
    /// </summary>
    public static IReadOnlyDictionary<string, string[]> Validate(VehicleMakeValues values, bool checkMakeCode)
    {
        var errors = new Dictionary<string, string[]>();

        if (checkMakeCode)
        {
            AddIfInvalidMakeCode(errors, values.MakeCode);
        }

        AddIfInvalidRequiredText(errors, "makeName", "Make name", values.MakeName, MakeNameMaxLength);
        AddIfInvalidRequiredText(errors, "shortName", "Short name", values.ShortName, ShortNameMaxLength);
        AddIfTooLong(errors, "remarks", values.Remarks, RemarksMaxLength);
        AddIfTooLong(errors, "arabicMakeName", values.ArabicMakeName, ArabicMakeNameMaxLength);
        AddIfTooLong(errors, "arabicShortName", values.ArabicShortName, ArabicShortNameMaxLength);
        AddIfTooLong(errors, "arabicRemarks", values.ArabicRemarks, ArabicRemarksMaxLength);

        return errors;
    }

    internal static string NormaliseEnglishName(string? value) =>
        CapitaliseWords(CollapseSpaces(value ?? string.Empty));

    // Remarks are free text, so only the spacing is tidied; line breaks and capitalisation are left as typed.
    internal static string? NormaliseOptionalEnglishText(string? value)
    {
        var collapsed = CollapseSpaces(value ?? string.Empty);
        return collapsed.Length == 0 ? null : collapsed;
    }

    // Arabic text must come back exactly as typed, including its spacing. Only "nothing at all" becomes empty.
    internal static string? KeepArabicExactly(string? value) =>
        string.IsNullOrEmpty(value) ? null : value;

    private static string CollapseSpaces(string value)
    {
        var builder = new StringBuilder(value.Length);
        var previousWasSpace = false;

        foreach (var character in value.Trim())
        {
            var isSpace = character == ' ';
            if (isSpace && previousWasSpace)
            {
                continue;
            }

            builder.Append(character);
            previousWasSpace = isSpace;
        }

        return builder.ToString();
    }

    private static string CapitaliseWords(string value) =>
        string.Join(' ', value.Split(' ').Select(CapitaliseWord));

    // Only the first letter is raised, so brand spellings such as "McLaren" survive. A word typed entirely
    // in capitals, such as "BMW", is already as the user wants it.
    private static string CapitaliseWord(string word)
    {
        if (word.Length == 0 || IsEntirelyCapitals(word))
        {
            return word;
        }

        return char.ToUpperInvariant(word[0]) + word[1..];
    }

    private static bool IsEntirelyCapitals(string word) =>
        word.Any(char.IsLetter) && !word.Any(char.IsLower);

    private static void AddIfInvalidMakeCode(Dictionary<string, string[]> errors, string makeCode)
    {
        if (makeCode.Length == 0)
        {
            errors["makeCode"] = ["Make code is required."];
        }
        else if (makeCode.Length > MakeCodeMaxLength)
        {
            errors["makeCode"] = [MaximumCharactersMessage(MakeCodeMaxLength)];
        }
        else if (!makeCode.All(IsAllowedMakeCodeCharacter))
        {
            errors["makeCode"] = ["Make code can contain only letters, digits and hyphens."];
        }
    }

    // The code has already been converted to capitals, so only capital letters need to be accepted.
    internal static bool IsAllowedMakeCodeCharacter(char character) =>
        character is (>= 'A' and <= 'Z') or (>= '0' and <= '9') or '-';

    internal static void AddIfInvalidRequiredText(
        Dictionary<string, string[]> errors,
        string fieldName,
        string displayName,
        string value,
        int maximumLength)
    {
        if (value.Length == 0)
        {
            errors[fieldName] = [$"{displayName} is required."];
        }
        else if (value.Length > maximumLength)
        {
            errors[fieldName] = [MaximumCharactersMessage(maximumLength)];
        }
    }

    internal static void AddIfTooLong(
        Dictionary<string, string[]> errors,
        string fieldName,
        string? value,
        int maximumLength)
    {
        if (value is not null && value.Length > maximumLength)
        {
            errors[fieldName] = [MaximumCharactersMessage(maximumLength)];
        }
    }

    internal static string MaximumCharactersMessage(int maximumLength) =>
        $"Maximum {maximumLength} characters.";
}
