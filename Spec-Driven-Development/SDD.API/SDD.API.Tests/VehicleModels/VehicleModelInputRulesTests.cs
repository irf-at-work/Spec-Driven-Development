using SDD.API.DTOs;
using SDD.API.Services;

namespace SDD.API.Tests.VehicleModels;

public class VehicleModelInputRulesTests
{
    private static CreateVehicleModelRequest Request(
        string? modelCode = "x5",
        string? modelName = "x5 sport",
        string? shortName = "X5",
        string? remarks = null,
        string? arabicModelName = null,
        string? fuelType = null,
        int? engineCapacity = null,
        int? seats = null,
        int? passengers = null,
        int? drivers = null,
        int? makeYear = null,
        decimal? value = null,
        string? weight = null) =>
        new(
            modelCode,
            modelName,
            shortName,
            remarks,
            arabicModelName,
            null,
            null,
            null,
            null,
            weight,
            null,
            null,
            fuelType,
            engineCapacity,
            null,
            seats,
            passengers,
            drivers,
            null,
            makeYear,
            null,
            null,
            value,
            null);

    private static IReadOnlyDictionary<string, string[]> Errors(CreateVehicleModelRequest request, bool checkModelCode = true) =>
        VehicleModelInputRules.Validate(VehicleModelInputRules.Normalise("bmw", request), checkModelCode);

    [Fact]
    public void Both_codes_are_saved_in_capitals_and_the_names_are_tidied()
    {
        var values = VehicleModelInputRules.Normalise("bmw", Request(modelCode: " x5-m ", modelName: "x5   sport"));

        Assert.Equal("BMW", values.MakeCode);
        Assert.Equal("X5-M", values.ModelCode);
        Assert.Equal("X5 Sport", values.ModelName);
    }

    [Fact]
    public void Arabic_text_is_kept_exactly_as_typed()
    {
        var values = VehicleModelInputRules.Normalise("bmw", Request(arabicModelName: "  سيارة   رياضية "));

        Assert.Equal("  سيارة   رياضية ", values.ArabicModelName);
    }

    [Fact]
    public void An_empty_dropdown_is_stored_as_nothing_and_a_chosen_code_keeps_its_case()
    {
        var empty = VehicleModelInputRules.Normalise("bmw", Request(fuelType: "  "));
        var chosen = VehicleModelInputRules.Normalise("bmw", Request(fuelType: " Petrol "));

        Assert.Null(empty.FuelType);
        Assert.Equal("Petrol", chosen.FuelType);
    }

    [Fact]
    public void A_valid_model_has_no_errors()
    {
        var errors = Errors(Request(engineCapacity: 1998, seats: 5, passengers: 4, drivers: 1, makeYear: 2024, value: 85000.5m));

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("   ")]
    public void The_model_code_is_required_when_creating(string? modelCode)
    {
        Assert.Equal("Model code is required.", Errors(Request(modelCode: modelCode))["modelCode"][0]);
    }

    [Fact]
    public void The_model_code_allows_only_letters_digits_and_hyphens_and_twelve_characters()
    {
        Assert.Equal(
            "Model code can contain only letters, digits and hyphens.",
            Errors(Request(modelCode: "X 5"))["modelCode"][0]);
        Assert.Equal("Maximum 12 characters.", Errors(Request(modelCode: "ABCDEFGHIJKLM"))["modelCode"][0]);
    }

    [Fact]
    public void The_model_code_is_not_checked_when_updating()
    {
        Assert.DoesNotContain("modelCode", Errors(Request(modelCode: null), checkModelCode: false).Keys);
    }

    [Fact]
    public void Name_and_short_name_are_required_and_limited()
    {
        var errors = Errors(Request(modelName: " ", shortName: new string('A', 31)));

        Assert.Equal("Model name is required.", errors["modelName"][0]);
        Assert.Equal("Maximum 30 characters.", errors["shortName"][0]);
    }

    [Theory]
    [InlineData(1000)]
    [InlineData(-1)]
    public void Seats_must_be_a_whole_number_of_up_to_three_digits(int seats)
    {
        Assert.Equal("Seats must be a whole number from 0 to 999.", Errors(Request(seats: seats))["seats"][0]);
    }

    [Fact]
    public void Passengers_and_drivers_have_the_same_three_digit_limit()
    {
        var errors = Errors(Request(passengers: 1000, drivers: 1000));

        Assert.Contains("passengers", errors.Keys);
        Assert.Contains("drivers", errors.Keys);
    }

    [Fact]
    public void Make_year_is_limited_to_four_digits()
    {
        Assert.Equal("Make year must be a whole number from 0 to 9999.", Errors(Request(makeYear: 10000))["makeYear"][0]);
        Assert.Empty(Errors(Request(makeYear: 9999)));
    }

    [Fact]
    public void Engine_capacity_and_value_cannot_be_negative()
    {
        var errors = Errors(Request(engineCapacity: -1, value: -0.01m));

        Assert.Contains("engineCapacity", errors.Keys);
        Assert.Equal("Value must be zero or more.", errors["value"][0]);
    }

    [Fact]
    public void Weight_is_limited_to_one_hundred_characters()
    {
        Assert.Equal("Maximum 100 characters.", Errors(Request(weight: new string('9', 101)))["weight"][0]);
    }
}
