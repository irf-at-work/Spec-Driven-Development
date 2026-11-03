using System.Text;
using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed record PremiumAdjustmentValues(
    string CodeType,
    string Code,
    string CompanyCode,
    string Name,
    string ShortName,
    string DiscountType,
    string ChargesType,
    string ChargesCategory,
    string? Remarks,
    string? ArabicName,
    string? ArabicShortName,
    string? ArabicRemarks,
    bool? Active);

public static class PremiumAdjustmentInputRules
{
    public const int CodeMaxLength = 12;
    public const int CompanyCodeMaxLength = 12;
    public const int NameMaxLength = 100;
    public const int ShortNameMaxLength = 30;
    public const int RemarksMaxLength = 2000;
    public const int ArabicNameMaxLength = 100;
    public const int ArabicShortNameMaxLength = 30;
    public const int ArabicRemarksMaxLength = 2000;
    private const int ListCodeMaxLength = 12;

    public static PremiumAdjustmentValues Normalise(CreateAdjustmentCodeRequest request) =>
        new(
            NormaliseCode(request.CodeType),
            NormaliseCode(request.Code),
            NormaliseCode(request.CompanyCode),
            NormaliseEnglishName(request.Name),
            NormaliseEnglishName(request.ShortName),
            NormaliseCode(request.DiscountType),
            NormaliseCode(request.ChargesType),
            NormaliseCode(request.ChargesCategory),
            NormaliseOptionalEnglishText(request.Remarks),
            KeepArabicExactly(request.ArabicName),
            KeepArabicExactly(request.ArabicShortName),
            KeepArabicExactly(request.ArabicRemarks),
            request.Active);

    public static PremiumAdjustmentValues Normalise(
        string codeType,
        string code,
        string companyCode,
        UpdateAdjustmentCodeRequest request) =>
        new(
            NormaliseCode(codeType),
            NormaliseCode(code),
            NormaliseCode(companyCode),
            NormaliseEnglishName(request.Name),
            NormaliseEnglishName(request.ShortName),
            NormaliseCode(request.DiscountType),
            NormaliseCode(request.ChargesType),
            NormaliseCode(request.ChargesCategory),
            NormaliseOptionalEnglishText(request.Remarks),
            KeepArabicExactly(request.ArabicName),
            KeepArabicExactly(request.ArabicShortName),
            KeepArabicExactly(request.ArabicRemarks),
            request.Active);

    public static IReadOnlyDictionary<string, string[]> Validate(PremiumAdjustmentValues values, bool validateKey)
    {
        var errors = new Dictionary<string, string[]>();

        if (validateKey)
        {
            AddRequiredCode(errors, "codeType", "Code Type", values.CodeType, ListCodeMaxLength, validateCharacters: false);
            AddRequiredCode(errors, "code", "Code", values.Code, CodeMaxLength, validateCharacters: true);
            AddRequiredCode(errors, "companyCode", "Company Code", values.CompanyCode, CompanyCodeMaxLength, validateCharacters: true);
        }

        AddRequiredText(errors, "name", "Name", values.Name, NameMaxLength);
        AddRequiredText(errors, "shortName", "Short Name", values.ShortName, ShortNameMaxLength);
        AddRequiredCode(errors, "discountType", "Discount Type", values.DiscountType, ListCodeMaxLength, validateCharacters: false);
        AddRequiredCode(errors, "chargesType", "Charges Type", values.ChargesType, ListCodeMaxLength, validateCharacters: false);
        AddRequiredCode(errors, "chargesCategory", "Charges Category", values.ChargesCategory, ListCodeMaxLength, validateCharacters: false);
        AddTooLong(errors, "remarks", values.Remarks, RemarksMaxLength);
        AddTooLong(errors, "arabicName", values.ArabicName, ArabicNameMaxLength);
        AddTooLong(errors, "arabicShortName", values.ArabicShortName, ArabicShortNameMaxLength);
        AddTooLong(errors, "arabicRemarks", values.ArabicRemarks, ArabicRemarksMaxLength);

        return errors;
    }

    private static string NormaliseCode(string? value) => (value ?? string.Empty).Trim().ToUpperInvariant();

    private static string NormaliseEnglishName(string? value) =>
        CapitaliseWords(CollapseSpaces(value ?? string.Empty));

    private static string? NormaliseOptionalEnglishText(string? value)
    {
        var collapsed = CollapseSpaces(value ?? string.Empty);
        return collapsed.Length == 0 ? null : collapsed;
    }

    private static string? KeepArabicExactly(string? value) => string.IsNullOrEmpty(value) ? null : value;

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

    private static string CapitaliseWord(string word)
    {
        if (word.Length == 0 || (word.Any(char.IsLetter) && !word.Any(char.IsLower)))
        {
            return word;
        }

        return char.ToUpperInvariant(word[0]) + word[1..];
    }

    private static void AddRequiredCode(
        Dictionary<string, string[]> errors,
        string field,
        string label,
        string value,
        int maxLength,
        bool validateCharacters)
    {
        if (value.Length == 0)
        {
            errors[field] = [$"{label} is required."];
        }
        else if (value.Length > maxLength)
        {
            errors[field] = [$"Maximum {maxLength} characters."];
        }
        else if (validateCharacters && !value.All(IsAllowedCodeCharacter))
        {
            errors[field] = [$"{label} can contain only letters, digits and hyphens."];
        }
    }

    private static void AddRequiredText(
        Dictionary<string, string[]> errors,
        string field,
        string label,
        string value,
        int maxLength)
    {
        if (value.Length == 0)
        {
            errors[field] = [$"{label} is required."];
        }
        else if (value.Length > maxLength)
        {
            errors[field] = [$"Maximum {maxLength} characters."];
        }
    }

    private static void AddTooLong(Dictionary<string, string[]> errors, string field, string? value, int maxLength)
    {
        if (value is not null && value.Length > maxLength)
        {
            errors[field] = [$"Maximum {maxLength} characters."];
        }
    }

    private static bool IsAllowedCodeCharacter(char character) =>
        character is (>= 'A' and <= 'Z') or (>= '0' and <= '9') or '-';
}
