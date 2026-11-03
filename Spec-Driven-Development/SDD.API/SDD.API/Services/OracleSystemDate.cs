using System.Data;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SDD.API.Data;

namespace SDD.API.Services;

internal static class OracleSystemDate
{
    public static async Task<DateTime> GetAsync(
        CodesMasterContext context,
        CancellationToken cancellationToken)
    {
        var connection = context.Database.GetDbConnection();
        var openedHere = connection.State != ConnectionState.Open;
        if (openedHere)
        {
            await context.Database.OpenConnectionAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = "SELECT SYSDATE FROM DUAL";
            command.Transaction = context.Database.CurrentTransaction?.GetDbTransaction();
            var value = await command.ExecuteScalarAsync(cancellationToken);
            return value is DateTime date
                ? date
                : Convert.ToDateTime(value, CultureInfo.InvariantCulture);
        }
        finally
        {
            if (openedHere)
            {
                await context.Database.CloseConnectionAsync();
            }
        }
    }
}
