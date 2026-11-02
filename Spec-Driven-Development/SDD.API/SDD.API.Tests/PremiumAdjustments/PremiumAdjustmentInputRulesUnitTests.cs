using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Tests.PremiumAdjustments;

public sealed class PremiumAdjustmentInputRulesUnitTests
{
    [Fact]
    public void Create_normalises_keys_and_english_but_preserves_arabic()
    {
        var values = PremiumAdjustmentInputRules.Normalise(new CreateAdjustmentCodeRequest(
            " calc01 ",
            "zt123",
            "zc456",
            "  premium   cover  BMW  McLaren ",
            "  BMW  ",
            "disc01",
            "charge01",
            "cat01",
            "  multi   word  ",
            "  خصم   خاص ",
            null,
            null));

        Assert.Equal("CALC01", values.CodeType);
        Assert.Equal("ZT123", values.Code);
        Assert.Equal("ZC456", values.CompanyCode);
        Assert.Equal("Premium Cover BMW McLaren", values.Name);
        Assert.Equal("BMW", values.ShortName);
        Assert.Equal("multi word", values.Remarks);
        Assert.Equal("  خصم   خاص ", values.ArabicName);
    }

    [Fact]
    public void Create_validation_reports_required_fields_and_invalid_codes()
    {
        var values = PremiumAdjustmentInputRules.Normalise(new CreateAdjustmentCodeRequest(
            " ",
            "bad code",
            "",
            " ",
            "",
            "",
            "",
            "",
            null,
            null,
            null,
            null));

        var errors = PremiumAdjustmentInputRules.Validate(values, validateKey: true);

        foreach (var field in new[]
        {
            "codeType", "code", "companyCode", "name", "shortName",
            "discountType", "chargesType", "chargesCategory"
        })
        {
            Assert.Contains(field, errors.Keys);
        }

        Assert.Contains("letters, digits and hyphens", errors["code"][0]);
    }

    [Theory]
    [InlineData(13, 0, 0, 0)]
    [InlineData(0, 101, 0, 0)]
    [InlineData(0, 0, 31, 0)]
    [InlineData(0, 0, 0, 2001)]
    public void Create_validation_enforces_field_limits(
        int codeLength,
        int nameLength,
        int arabicShortNameLength,
        int arabicRemarksLength)
    {
        var values = ValidValues() with
        {
            Code = codeLength == 0 ? "ZT123" : new string('A', codeLength),
            Name = nameLength == 0 ? "Name" : new string('N', nameLength),
            ArabicShortName = arabicShortNameLength == 0 ? null : new string('ع', arabicShortNameLength),
            ArabicRemarks = arabicRemarksLength == 0 ? null : new string('ع', arabicRemarksLength)
        };

        var errors = PremiumAdjustmentInputRules.Validate(values, validateKey: true);

        if (codeLength > 0)
        {
            Assert.Contains("code", errors.Keys);
        }
        if (nameLength > 0)
        {
            Assert.Contains("name", errors.Keys);
        }
        if (arabicShortNameLength > 0)
        {
            Assert.Contains("arabicShortName", errors.Keys);
        }
        if (arabicRemarksLength > 0)
        {
            Assert.Contains("arabicRemarks", errors.Keys);
        }
    }

    [Fact]
    public void Update_does_not_validate_route_key_fields()
    {
        var values = PremiumAdjustmentInputRules.Normalise(
            "CALC01",
            "ZT123",
            "ZC456",
            new UpdateAdjustmentCodeRequest("Name", "Short", "DISC01", "CHG01", "CAT01", null, null, null, null));

        Assert.Empty(PremiumAdjustmentInputRules.Validate(values, validateKey: false));
    }

    private static PremiumAdjustmentValues ValidValues() =>
        new("CALC01", "ZT123", "ZC456", "Name", "Short", "DISC01", "CHG01", "CAT01", null, null, null, null, true);
}
