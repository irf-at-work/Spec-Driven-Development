using SDD.API.Data.Scaffolded;

namespace SDD.API.Services;

/// <summary>
/// Column filters for the models of one make (FR-030). Models are not sortable: they stay in Model Code order (FR-017).
/// The page size and the largest page are the same as for makes.
/// </summary>
public static class VehicleModelListQuery
{
    public static IReadOnlyDictionary<string, string[]> Validate(int page, ColumnFilters filters)
    {
        var errors = new Dictionary<string, string[]>();

        ColumnFilterQuery.ValidatePage(page, errors);
        ColumnFilterQuery.ValidateOperators(filters, "modelCode", "modelName", errors);

        return errors;
    }

    /// <summary>Assumes <see cref="Validate"/> has already passed. Returns the models in Model Code order.</summary>
    public static IQueryable<BrmVehModel> Apply(IQueryable<BrmVehModel> source, ColumnFilters filters) =>
        ColumnFilterQuery
            .Apply(
                source,
                filters,
                model => model.VmodCode,
                model => model.VmodName,
                model => model.VmodShortName,
                model => model.VmodActiveYn)
            .OrderBy(model => model.VmodCode);
}
