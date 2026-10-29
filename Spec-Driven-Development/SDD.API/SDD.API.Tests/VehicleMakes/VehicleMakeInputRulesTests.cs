using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Tests.VehicleMakes;

public class VehicleMakeInputRulesTests
{
    private static CreateVehicleMakeRequest Request(
        string? makeCode = "TOY",
        string? makeName = "Toyota",
        string? shortName = "Toyota",
        string? remarks = null,
        string? arabicMakeName = null,
        string? arabicShortName = null,
        string? arabicRemarks = null) =>
        new(makeCode, makeName, shortName, remarks, arabicMakeName, arabicShortName, arabicRemarks);

    private static IReadOnlyDictionary<string, string[]> ValidateCreate(CreateVehicleMakeRequest request) =>
        VehicleMakeInputRules.Validate(VehicleMakeInputRules.Normalise(request), checkMakeCode: true);

    [Fact]
    public void Make_code_is_trimmed_and_saved_in_capitals()
    {
        var values = VehicleMakeInputRules.Normalise(Request(makeCode: "  ab-12 "));

        Assert.Equal("AB-12", values.MakeCode);
    }

    [Theory]
    [InlineData("toyota motor", "Toyota Motor")]
    [InlineData("  toyota    motor  ", "Toyota Motor")]
    [InlineData("BMW group", "BMW Group")]
    [InlineData("mcLaren", "McLaren")]
    public void English_names_get_a_capital_first_letter_and_lose_extra_spaces(string typed, string saved)
    {
        var values = VehicleMakeInputRules.Normalise(Request(makeName: typed, shortName: typed));

        Assert.Equal(saved, values.MakeName);
        Assert.Equal(saved, values.ShortName);
    }

    [Fact]
    public void Arabic_text_is_kept_exactly_including_its_spacing()
    {
        const string arabic = "  تويوتا   موتور ";

        var values = VehicleMakeInputRules.Normalise(
            Request(arabicMakeName: arabic, arabicShortName: arabic, arabicRemarks: arabic));

        Assert.Equal(arabic, values.ArabicMakeName);
        Assert.Equal(arabic, values.ArabicShortName);
        Assert.Equal(arabic, values.ArabicRemarks);
    }

    [Fact]
    public void Empty_optional_values_are_saved_as_nothing()
    {
        var values = VehicleMakeInputRules.Normalise(Request(remarks: "   ", arabicMakeName: ""));

        Assert.Null(values.Remarks);
        Assert.Null(values.ArabicMakeName);
    }

    [Fact]
    public void Remarks_lose_extra_spaces_but_keep_line_breaks_and_capitalisation()
    {
        var values = VehicleMakeInputRules.Normalise(Request(remarks: "  first   line\nsecond line "));

        Assert.Equal("first line\nsecond line", values.Remarks);
    }

    [Fact]
    public void A_complete_valid_request_has_no_errors()
    {
        Assert.Empty(ValidateCreate(Request()));
    }

    [Fact]
    public void A_blank_make_code_is_reported_as_required()
    {
        var errors = ValidateCreate(Request(makeCode: "   "));

        Assert.Equal("Make code is required.", Assert.Single(errors["makeCode"]));
    }

    [Theory]
    [InlineData("AB_1")]
    [InlineData("AB 1")]
    [InlineData("TOYÖTA")]
    public void A_make_code_with_other_characters_is_rejected(string makeCode)
    {
        var errors = ValidateCreate(Request(makeCode: makeCode));

        Assert.Equal("Make code can contain only letters, digits and hyphens.", Assert.Single(errors["makeCode"]));
    }

    [Fact]
    public void A_make_code_of_twelve_characters_is_accepted_and_thirteen_is_not()
    {
        Assert.Empty(ValidateCreate(Request(makeCode: new string('A', 12))));

        var errors = ValidateCreate(Request(makeCode: new string('A', 13)));

        Assert.Equal("Maximum 12 characters.", Assert.Single(errors["makeCode"]));
    }

    [Fact]
    public void Missing_names_are_reported_as_required()
    {
        var errors = ValidateCreate(Request(makeName: null, shortName: " "));

        Assert.Equal("Make name is required.", Assert.Single(errors["makeName"]));
        Assert.Equal("Short name is required.", Assert.Single(errors["shortName"]));
    }

    [Fact]
    public void Every_field_limit_is_enforced()
    {
        var errors = ValidateCreate(Request(
            makeName: new string('a', 101),
            shortName: new string('a', 31),
            remarks: new string('a', 2001),
            arabicMakeName: new string('ع', 101),
            arabicShortName: new string('ع', 31),
            arabicRemarks: new string('ع', 2001)));

        Assert.Equal("Maximum 100 characters.", Assert.Single(errors["makeName"]));
        Assert.Equal("Maximum 30 characters.", Assert.Single(errors["shortName"]));
        Assert.Equal("Maximum 2000 characters.", Assert.Single(errors["remarks"]));
        Assert.Equal("Maximum 100 characters.", Assert.Single(errors["arabicMakeName"]));
        Assert.Equal("Maximum 30 characters.", Assert.Single(errors["arabicShortName"]));
        Assert.Equal("Maximum 2000 characters.", Assert.Single(errors["arabicRemarks"]));
    }

    [Fact]
    public void Fields_exactly_at_their_limits_are_accepted()
    {
        var errors = ValidateCreate(Request(
            makeName: new string('a', 100),
            shortName: new string('a', 30),
            remarks: new string('a', 2000),
            arabicMakeName: new string('ع', 100),
            arabicShortName: new string('ع', 30),
            arabicRemarks: new string('ع', 2000)));

        Assert.Empty(errors);
    }

    [Fact]
    public void On_update_the_make_code_is_not_checked_because_it_cannot_change()
    {
        var update = new UpdateVehicleMakeRequest("Toyota", "Toyota", null, null, null, null);
        var values = VehicleMakeInputRules.Normalise("not a valid code!", update);

        Assert.Empty(VehicleMakeInputRules.Validate(values, checkMakeCode: false));
    }
}
