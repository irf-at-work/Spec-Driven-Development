using Microsoft.EntityFrameworkCore;
using SDD.API.Data.Scaffolded;
using SDD.API.DTOs;

namespace SDD.API.Services;

public sealed class MasterDataImportService(SddDbContext db, VehicleMakeService makes, PremiumAdjustmentService adjustments, VehicleModelService models)
{
    public const int MaximumRows = 1000;

    public async Task<VehicleModelImportPreviewDto> PreviewModelsAsync(string makeCode, IReadOnlyList<Dictionary<string,string?>>? rows, CancellationToken ct)
    {
        if(rows is null||rows.Count==0)return new([], ["The workbook contains no data rows."]);
        if(rows.Count>MaximumRows)return new([],[$"The workbook can contain no more than {MaximumRows} data rows."]);
        makeCode=VehicleMakeInputRules.NormaliseMakeCode(makeCode);
        var makeExists=await db.BrmVehMakes.CountAsync(x=>x.VmakCode==makeCode,ct)>0;
        var normalized=rows.Select((r,i)=> {
            var errors=new List<string>();
            int? Number(string key,string label,int? max=null) { var text=r.GetValueOrDefault(key)?.Trim(); if(string.IsNullOrEmpty(text))return null; if(!int.TryParse(text,System.Globalization.NumberStyles.Integer,System.Globalization.CultureInfo.InvariantCulture,out var n)){errors.Add($"{label} must be a whole number.");return null;} if(max is not null&&(n<0||n>max)){errors.Add($"{label} must be from 0 to {max}.");return null;} if(max is null&&n<0){errors.Add($"{label} must be zero or more.");return null;} return n; }
            decimal? Value() { var text=r.GetValueOrDefault("value")?.Trim();if(string.IsNullOrEmpty(text))return null;if(!decimal.TryParse(text,System.Globalization.NumberStyles.Number,System.Globalization.CultureInfo.InvariantCulture,out var n)||n<0){errors.Add("Value must be a number of zero or more.");return null;}return n; }
            bool? Active() { var text=r.GetValueOrDefault("active")?.Trim();if(string.IsNullOrEmpty(text))return null;if(text.Equals("Y",StringComparison.OrdinalIgnoreCase))return true;if(text.Equals("N",StringComparison.OrdinalIgnoreCase))return false;errors.Add("Active must be Y or N.");return null; }
            var request=new CreateVehicleModelRequest(r.GetValueOrDefault("modelCode"),r.GetValueOrDefault("modelName"),r.GetValueOrDefault("shortName"),r.GetValueOrDefault("remarks"),r.GetValueOrDefault("arabicModelName"),r.GetValueOrDefault("arabicShortName"),r.GetValueOrDefault("arabicRemarks"),r.GetValueOrDefault("variant"),r.GetValueOrDefault("vehicleType"),r.GetValueOrDefault("weight"),r.GetValueOrDefault("loadCapacity"),r.GetValueOrDefault("bodyType"),r.GetValueOrDefault("fuelType"),Number("engineCapacity","Engine capacity"),r.GetValueOrDefault("cylinders"),Number("seats","Seats",999),Number("passengers","Passengers",999),Number("drivers","Drivers",999),r.GetValueOrDefault("doors"),Number("makeYear","Make year",9999),r.GetValueOrDefault("drivingType"),r.GetValueOrDefault("bodyColour"),Value(),r.GetValueOrDefault("category"),Active());
            var values=VehicleModelInputRules.Normalise(makeCode,request); errors.AddRange(VehicleModelInputRules.Validate(values,true).Values.SelectMany(x=>x));
            return (Index: i+2, Raw: r, Values: values, Errors: errors);
        }).ToArray();
        var dupes=normalized.GroupBy(x=>x.Values.ModelCode,StringComparer.OrdinalIgnoreCase).Where(g=>g.Key.Length>0&&g.Count()>1).SelectMany(g=>g).Select(x=>x.Index).ToHashSet();
        if(!makeExists)return new([],[$"Vehicle make {makeCode} does not exist."]);
        var codes=normalized.Select(x=>x.Values.ModelCode).Where(x=>x.Length>0).Distinct().ToArray();
        var existing=(await db.BrmVehModels.AsNoTracking().Where(x=>x.VmodVmakCode==makeCode&&codes.Contains(x.VmodCode)).Select(x=>x.VmodCode).ToListAsync(ct)).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var activeOptions=(await db.StdListItems.AsNoTracking().Where(x=>x.LiActiveYn=="Y"&&VehicleModelListTypes.All.Contains(x.LiType)).Select(x=>new{x.LiType,x.LiCode}).ToListAsync(ct)).Select(x=>$"{x.LiType}\u001f{x.LiCode}").ToHashSet(StringComparer.OrdinalIgnoreCase);
        var output=new List<VehicleModelImportPreviewRowDto>();
        foreach(var x in normalized){var errors=x.Errors.ToList();if(dupes.Contains(x.Index))errors.Add("This model code appears more than once in the workbook.");var exists=existing.Contains(x.Values.ModelCode);if(!exists){var vals=new[]{(VehicleModelListTypes.Variant,x.Values.Variant),(VehicleModelListTypes.VehicleType,x.Values.VehicleType),(VehicleModelListTypes.BodyType,x.Values.BodyType),(VehicleModelListTypes.FuelType,x.Values.FuelType),(VehicleModelListTypes.Cylinders,x.Values.Cylinders),(VehicleModelListTypes.Doors,x.Values.Doors),(VehicleModelListTypes.DrivingType,x.Values.DrivingType),(VehicleModelListTypes.BodyColour,x.Values.BodyColour),(VehicleModelListTypes.Category,x.Values.Category)};foreach(var (type,code) in vals)if(code is not null&&!activeOptions.Contains($"{type}\u001f{code}"))errors.Add($"{code} is not an active option for {type}.");}output.Add(new(x.Index,x.Values.ModelCode,x.Values.ModelName,exists,errors));}
        return new(output,[]);
    }

    public async Task<MasterImportResultDto> ImportModelsAsync(string makeCode,IReadOnlyList<Dictionary<string,string?>>? rows,CancellationToken ct)
    {
        var preview=await PreviewModelsAsync(makeCode,rows,ct);if(preview.Errors.Count>0||preview.Rows.Any(x=>!x.IsValid))throw new InvalidOperationException("Import contains invalid rows. Preview the workbook and correct them.");
        var inserted=0;await using var tx=await db.Database.BeginTransactionAsync(ct);
        for(var i=0;i<rows!.Count;i++){if(preview.Rows[i].AlreadyExists)continue;var raw=rows[i];var values=VehicleModelInputRules.Normalise(makeCode,BuildModelRequest(raw));var result=await models.CreateAsync(values,ct);if(result.Outcome!=VehicleModelOutcome.Saved)throw new InvalidOperationException("A model key or dropdown option changed during import. Retry the preview.");inserted++;}
        await tx.CommitAsync(ct);return new(inserted,preview.Rows.Count-inserted);
    }

    private static CreateVehicleModelRequest BuildModelRequest(Dictionary<string,string?> r)
    {
        int? N(string key)=>int.TryParse(r.GetValueOrDefault(key),System.Globalization.NumberStyles.Integer,System.Globalization.CultureInfo.InvariantCulture,out var n)?n:null;
        decimal? D(string key)=>decimal.TryParse(r.GetValueOrDefault(key),System.Globalization.NumberStyles.Number,System.Globalization.CultureInfo.InvariantCulture,out var n)?n:null;
        bool? A()=>r.GetValueOrDefault("active")?.Trim().ToUpperInvariant() switch{"Y"=>true,"N"=>false,_=>null};
        return new(r.GetValueOrDefault("modelCode"),r.GetValueOrDefault("modelName"),r.GetValueOrDefault("shortName"),r.GetValueOrDefault("remarks"),r.GetValueOrDefault("arabicModelName"),r.GetValueOrDefault("arabicShortName"),r.GetValueOrDefault("arabicRemarks"),r.GetValueOrDefault("variant"),r.GetValueOrDefault("vehicleType"),r.GetValueOrDefault("weight"),r.GetValueOrDefault("loadCapacity"),r.GetValueOrDefault("bodyType"),r.GetValueOrDefault("fuelType"),N("engineCapacity"),r.GetValueOrDefault("cylinders"),N("seats"),N("passengers"),N("drivers"),r.GetValueOrDefault("doors"),N("makeYear"),r.GetValueOrDefault("drivingType"),r.GetValueOrDefault("bodyColour"),D("value"),r.GetValueOrDefault("category"),A());
    }

    public async Task<VehicleMakeImportPreviewDto> PreviewMakesAsync(IReadOnlyList<VehicleMakeImportRowDto>? rows, CancellationToken ct)
    {
        if (rows is null || rows.Count == 0) return new([], ["The workbook contains no data rows."]);
        if (rows.Count > MaximumRows) return new([], [$"The workbook can contain no more than {MaximumRows} data rows."]);
        var normalized = rows.Select(r => (Source:r, Code:VehicleMakeInputRules.NormaliseMakeCode(r.MakeCode), Values:VehicleMakeInputRules.Normalise(new CreateVehicleMakeRequest(r.MakeCode,r.MakeName,r.ShortName,r.Remarks,r.ArabicMakeName,r.ArabicShortName,r.ArabicRemarks,r.Active)))).ToArray();
        var dupes = normalized.GroupBy(x => x.Code, StringComparer.OrdinalIgnoreCase).Where(g => g.Count()>1).SelectMany(g=>g).Select(x=>x.Source.RowNumber).ToHashSet();
        var codes = normalized.Select(x=>x.Code).Where(x=>x.Length>0).Distinct().ToArray();
        var existing = (await db.BrmVehMakes.AsNoTracking().Where(x=>codes.Contains(x.VmakCode)).Select(x=>x.VmakCode).ToListAsync(ct)).ToHashSet(StringComparer.OrdinalIgnoreCase);
        return new(normalized.Select(x => {
            var errors=VehicleMakeInputRules.Validate(x.Values,true).Values.SelectMany(v=>v).ToList();
            if (!string.IsNullOrWhiteSpace(x.Source.ActiveText) && x.Source.ActiveText.Trim().ToUpperInvariant() is not ("Y" or "N")) errors.Add("Active must be Y or N.");
            if(dupes.Contains(x.Source.RowNumber)) errors.Add("This make code appears more than once in the workbook.");
            return new VehicleMakeImportPreviewRowDto(x.Source.RowNumber,x.Code,x.Values.MakeName,x.Values.ShortName,existing.Contains(x.Code),errors);
        }).ToArray(), []);
    }

    public async Task<MasterImportResultDto> ImportMakesAsync(IReadOnlyList<VehicleMakeImportRowDto>? rows, CancellationToken ct)
    {
        var preview=await PreviewMakesAsync(rows,ct);
        if(preview.Errors.Count>0 || preview.Rows.Any(x=>!x.IsValid)) throw new InvalidOperationException("Import contains invalid rows. Preview the workbook and correct them.");
        var inserted=0;
        await using var tx=await db.Database.BeginTransactionAsync(ct);
        foreach(var row in rows!.Where((_,i)=>!preview.Rows[i].AlreadyExists)) {
            var result=await makes.CreateAsync(VehicleMakeInputRules.Normalise(new CreateVehicleMakeRequest(row.MakeCode,row.MakeName,row.ShortName,row.Remarks,row.ArabicMakeName,row.ArabicShortName,row.ArabicRemarks,row.Active)),ct);
            if(result is null) throw new InvalidOperationException("A make key was added during import. Retry the preview.");
            inserted++;
        }
        await tx.CommitAsync(ct);
        return new(inserted,preview.Rows.Count-inserted);
    }

    public async Task<PremiumAdjustmentImportPreviewDto> PreviewAdjustmentsAsync(IReadOnlyList<PremiumAdjustmentImportRowDto>? rows,CancellationToken ct)
    {
        if(rows is null||rows.Count==0)return new([], ["The workbook contains no data rows."]);
        if(rows.Count>MaximumRows)return new([],[$"The workbook can contain no more than {MaximumRows} data rows."]);
        var normalized=rows.Select(r=>(Source:r,Values:PremiumAdjustmentInputRules.Normalise(new CreateAdjustmentCodeRequest(r.CodeType,r.Code,r.CompanyCode,r.Name,r.ShortName,r.DiscountType,r.ChargesType,r.ChargesCategory,r.Remarks,r.ArabicName,r.ArabicShortName,r.ArabicRemarks,r.Active)))).ToArray();
        var key=(PremiumAdjustmentValues v)=>$"{v.CodeType}\u001f{v.Code}\u001f{v.CompanyCode}";
        var dupes=normalized.GroupBy(x=>key(x.Values),StringComparer.OrdinalIgnoreCase).Where(g=>g.Count()>1).SelectMany(g=>g).Select(x=>x.Source.RowNumber).ToHashSet();
        var items=normalized.Select(x=>x.Values).ToArray();
        var codes=items.Select(x=>x.Code).Distinct().ToArray(); var types=items.Select(x=>x.CodeType).Distinct().ToArray(); var companies=items.Select(x=>x.CompanyCode).Distinct().ToArray();
        var existing=(await db.BrmMiscCodes.AsNoTracking().Where(x=>types.Contains(x.McType)&&codes.Contains(x.McCode)&&companies.Contains(x.McCompCode)).Select(x=>new{x.McType,x.McCode,x.McCompCode}).ToListAsync(ct)).Select(x=>$"{x.McType}\u001f{x.McCode}\u001f{x.McCompCode}").ToHashSet(StringComparer.OrdinalIgnoreCase);
        var activeOptions=(await db.StdListItems.AsNoTracking().Where(x=>x.LiActiveYn=="Y"&&(x.LiType=="CALC_TYPE"||x.LiType=="DISCOUNT_TYPE"||x.LiType=="CHARGE_TYPE"||x.LiType=="CHARGE_CAT")).Select(x=>new{x.LiType,x.LiCode}).ToListAsync(ct)).Select(x=>$"{x.LiType}\u001f{x.LiCode}").ToHashSet(StringComparer.OrdinalIgnoreCase);
        var previewRows = new List<PremiumAdjustmentImportPreviewRowDto>();
        foreach (var x in normalized) {
            var v=x.Values; var errors=PremiumAdjustmentInputRules.Validate(v,true).Values.SelectMany(e=>e).ToList();
            if (!string.IsNullOrWhiteSpace(x.Source.ActiveText) && x.Source.ActiveText.Trim().ToUpperInvariant() is not ("Y" or "N")) errors.Add("Active must be Y or N.");
            if(dupes.Contains(x.Source.RowNumber))errors.Add("This adjustment key appears more than once in the workbook.");
            var exists=existing.Contains(key(v));
            if (!exists) {
                if (!activeOptions.Contains($"CALC_TYPE\u001f{v.CodeType}")) errors.Add("Choose an active Code Type from the list.");
                if (!activeOptions.Contains($"DISCOUNT_TYPE\u001f{v.DiscountType}")) errors.Add("Choose an active Discount Type from the list.");
                if (!activeOptions.Contains($"CHARGE_TYPE\u001f{v.ChargesType}")) errors.Add("Choose an active Charges Type from the list.");
                if (!activeOptions.Contains($"CHARGE_CAT\u001f{v.ChargesCategory}")) errors.Add("Choose an active Charges Category from the list.");
            }
            previewRows.Add(new PremiumAdjustmentImportPreviewRowDto(x.Source.RowNumber,v.CodeType,v.Code,v.CompanyCode,v.Name,v.ShortName,exists,errors));
        }
        return new(previewRows,[]);
    }

    public async Task<MasterImportResultDto> ImportAdjustmentsAsync(IReadOnlyList<PremiumAdjustmentImportRowDto>? rows,CancellationToken ct)
    {
        var preview=await PreviewAdjustmentsAsync(rows,ct);
        if(preview.Errors.Count>0||preview.Rows.Any(x=>!x.IsValid))throw new InvalidOperationException("Import contains invalid rows. Preview the workbook and correct them.");
        var inserted=0; await using var tx=await db.Database.BeginTransactionAsync(ct);
        for(var i=0;i<rows!.Count;i++) {
            if(preview.Rows[i].AlreadyExists)continue; var r=rows[i];
            var result=await adjustments.CreateAsync(PremiumAdjustmentInputRules.Normalise(new CreateAdjustmentCodeRequest(r.CodeType,r.Code,r.CompanyCode,r.Name,r.ShortName,r.DiscountType,r.ChargesType,r.ChargesCategory,r.Remarks,r.ArabicName,r.ArabicShortName,r.ArabicRemarks,r.Active)),ct);
            if(result.Outcome!=PremiumAdjustmentSaveOutcome.Saved)throw new InvalidOperationException("An adjustment key or lookup changed during import. Retry the preview."); inserted++;
        }
        await tx.CommitAsync(ct); return new(inserted,preview.Rows.Count-inserted);
    }
}
