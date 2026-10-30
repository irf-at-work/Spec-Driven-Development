using Microsoft.EntityFrameworkCore;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class CodesRepository(CodesMasterContext context) : ICodesRepository
{
    public Task<int> CountAsync(CancellationToken cancellationToken) =>
        context.STD_CODES.CountAsync(cancellationToken);

    public async Task<IReadOnlyList<STD_CODES>> GetPageAsync(
        int skip,
        int pageSize,
        CancellationToken cancellationToken) =>
        await context.STD_CODES
            .AsNoTracking()
            .OrderBy(record => record.CC_CODE)
            .ThenBy(record => record.CC_TYPE)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

    public Task<STD_CODES?> FindAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken) =>
        context.STD_CODES.SingleOrDefaultAsync(
            record => record.CC_CODE == code && record.CC_TYPE == codeType,
            cancellationToken);

    public async Task<bool> ExistsAsync(
        string code,
        string codeType,
        CancellationToken cancellationToken)
    {
        var count = await context.STD_CODES.CountAsync(
            record => record.CC_CODE == code && record.CC_TYPE == codeType,
            cancellationToken);
        return count > 0;
    }

    public async Task AddAsync(STD_CODES record, CancellationToken cancellationToken) =>
        await context.STD_CODES.AddAsync(record, cancellationToken);

    public async Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _ = await context.SaveChangesAsync(cancellationToken);

    public void Remove(STD_CODES record) => context.STD_CODES.Remove(record);
}
