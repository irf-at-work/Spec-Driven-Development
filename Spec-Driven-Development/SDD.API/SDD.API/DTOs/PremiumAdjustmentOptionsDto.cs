namespace SDD.API.DTOs;

public sealed record PremiumAdjustmentOptionsDto(
    IReadOnlyList<LookupOptionDto> CodeTypes,
    IReadOnlyList<LookupOptionDto> DiscountTypes,
    IReadOnlyList<LookupOptionDto> ChargesTypes,
    IReadOnlyList<LookupOptionDto> ChargesCategories);
