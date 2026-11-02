using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class CodesService(
    ICodesRepository repository,
    CodesFieldValidator validator,
    ILogger<CodesService> logger) : ICodesService
{
    public async Task<PaginatedResult<CodeRecordResponse>> ListAsync(
        int page,
        int pageSize,
        IReadOnlyList<CodeColumnFilter> filters,
        CodeSortColumn sortBy,
        CodeSortDirection sortDirection,
        CancellationToken cancellationToken)
    {
        var skip = (long)(page - 1) * pageSize;
        if (skip > int.MaxValue)
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The requested page is not available.",
                "Choose a lower page number or page size.");
        }

        var totalCount = await repository.CountAsync(filters, cancellationToken);
        var records = await repository.GetPageAsync(
            (int)skip,
            pageSize,
            filters,
            sortBy,
            sortDirection,
            cancellationToken);

        return new PaginatedResult<CodeRecordResponse>(
            records.Select(Map).ToArray(),
            page,
            pageSize,
            totalCount);
    }

    public async Task<CodeRecordResponse?> GetAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken)
    {
        validator.EnsureValid(new CodeWriteRequest { Code = code, CodeType = codeType });
        var record = await repository.FindAsync(code, codeType, cancellationToken);
        return record is null ? null : Map(record);
    }

    public async Task<CodeRecordResponse> CreateAsync(
        CodeWriteRequest request,
        CancellationToken cancellationToken)
    {
        validator.EnsureValid(request);
        if (await repository.ExistsAsync(request.Code, request.CodeType, cancellationToken))
        {
            throw DuplicateRecord();
        }

        var record = CreateRecord(request);
        record.CC_CR_DT = await repository.GetSystemDateAsync(cancellationToken);
        try
        {
            await repository.AddAsync(record, cancellationToken);
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (OracleException exception) when (exception.Number == 1)
        {
            throw DuplicateRecord();
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number == 1)
        {
            throw DuplicateRecord();
        }

        logger.LogInformation("Created a Codes Master record.");
        return Map(record);
    }

    public async Task<CodeRecordResponse?> UpdateAsync(
        string code,
        string codeType,
        CodeWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (!string.Equals(request.Code, code, StringComparison.Ordinal) ||
            !string.Equals(request.CodeType, codeType, StringComparison.Ordinal))
        {
            throw new CodesApiException(
                StatusCodes.Status400BadRequest,
                "The record identity cannot be changed.",
                "Keep Code and Code Type the same as the selected record.",
                new Dictionary<string, string[]>
                {
                    ["code"] = ["Code must match the selected record."],
                    ["codeType"] = ["Code Type must match the selected record."]
                });
        }

        validator.EnsureValid(request);
        var record = await repository.FindAsync(code, codeType, cancellationToken);
        if (record is null)
        {
            return null;
        }

        ApplyEditableValues(record, request);
        record.CC_UP_BY = "ADMIN";
        record.CC_UP_DT = await repository.GetSystemDateAsync(cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated a Codes Master record.");
        return Map(record);
    }

    public async Task<bool> DeleteAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken)
    {
        validator.EnsureValid(new CodeWriteRequest { Code = code, CodeType = codeType });
        var record = await repository.FindAsync(code, codeType, cancellationToken);
        if (record is null)
        {
            return false;
        }

        repository.Remove(record);
        try
        {
            await repository.SaveChangesAsync(cancellationToken);
        }
        catch (OracleException exception) when (exception.Number is 2290 or 2291 or 2292)
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The code could not be deleted.",
                "Another record depends on this code. Refresh the listing and try again.");
        }
        catch (DbUpdateException exception) when (FindOracleException(exception)?.Number is 2290 or 2291 or 2292)
        {
            throw new CodesApiException(
                StatusCodes.Status409Conflict,
                "The code could not be deleted.",
                "Another record depends on this code. Refresh the listing and try again.");
        }

        logger.LogInformation("Deleted a Codes Master record.");
        return true;
    }

    private static STD_CODES CreateRecord(CodeWriteRequest request) =>
        new()
        {
            CC_CODE = request.Code,
            CC_TYPE = request.CodeType,
            CC_COMP_CODE = request.Code,
            CC_DESC = request.CodeDescription,
            CC_SHORT_DESC = request.ShortDescription,
            CC_LONG_DESC = request.LongDescription,
            CC_VALUE1 = request.Value1,
            CC_VALUE2 = request.Value2,
            CC_FLEX_01 = request.Flex1,
            CC_FLEX_02 = request.Flex2,
            CC_DESC_L2 = request.DescriptionInArabic,
            CC_SHORT_DESC_L2 = request.ShortDescriptionInArabic,
            CC_LONG_DESC_L2 = request.LongDescriptionInArabic,
            CC_ACTIVE_YN = request.ActiveYn,
            CC_CR_BY = "ADMIN",
            CC_UP_BY = null,
            CC_UP_DT = null
        };

    private static void ApplyEditableValues(STD_CODES record, CodeWriteRequest request)
    {
        record.CC_DESC = request.CodeDescription;
        record.CC_SHORT_DESC = request.ShortDescription;
        record.CC_LONG_DESC = request.LongDescription;
        record.CC_VALUE1 = request.Value1;
        record.CC_VALUE2 = request.Value2;
        record.CC_FLEX_01 = request.Flex1;
        record.CC_FLEX_02 = request.Flex2;
        record.CC_DESC_L2 = request.DescriptionInArabic;
        record.CC_SHORT_DESC_L2 = request.ShortDescriptionInArabic;
        record.CC_LONG_DESC_L2 = request.LongDescriptionInArabic;
        record.CC_ACTIVE_YN = request.ActiveYn;
    }

    private static CodeRecordResponse Map(STD_CODES record) =>
        new()
        {
            Code = record.CC_CODE,
            CodeType = record.CC_TYPE,
            CompanyCode = record.CC_COMP_CODE,
            CodeDescription = record.CC_DESC,
            ShortDescription = record.CC_SHORT_DESC,
            LongDescription = record.CC_LONG_DESC,
            Value1 = record.CC_VALUE1,
            Value2 = record.CC_VALUE2,
            Flex1 = record.CC_FLEX_01,
            Flex2 = record.CC_FLEX_02,
            DescriptionInArabic = record.CC_DESC_L2,
            ShortDescriptionInArabic = record.CC_SHORT_DESC_L2,
            LongDescriptionInArabic = record.CC_LONG_DESC_L2,
            ActiveYn = record.CC_ACTIVE_YN,
            CreatedBy = record.CC_CR_BY,
            CreatedDate = record.CC_CR_DT,
            UpdatedBy = record.CC_UP_BY,
            UpdatedDate = record.CC_UP_DT
        };

    private static CodesApiException DuplicateRecord() =>
        new(
            StatusCodes.Status409Conflict,
            "This code already exists.",
            "A record with the same Code and Code Type already exists.");

    private static OracleException? FindOracleException(Exception exception)
    {
        for (var current = exception; current is not null; current = current.InnerException!)
        {
            if (current is OracleException oracleException)
            {
                return oracleException;
            }
        }

        return null;
    }
}
