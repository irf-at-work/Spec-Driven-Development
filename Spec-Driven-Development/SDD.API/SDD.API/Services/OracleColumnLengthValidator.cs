using System.Data;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using SDD.API.Contracts;
using SDD.API.Data;

namespace SDD.API.Services;

public sealed class OracleColumnLengthValidator(CodesMasterContext context)
{
    public async Task<IReadOnlyList<OracleColumnLength>> ValidateAsync(
        IReadOnlyList<OracleColumnValue> values,
        CancellationToken cancellationToken)
    {
        if (values.Count == 0)
        {
            return [];
        }

        var connection = context.Database.GetDbConnection();
        var openedHere = connection.State != ConnectionState.Open;
        if (openedHere)
        {
            await context.Database.OpenConnectionAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            ((OracleCommand)command).BindByName = true;
            command.CommandText = BuildQuery(values.Count);
            AddParameter(command, "owner", "IIRIS_RD_DEVP");

            for (var index = 0; index < values.Count; index++)
            {
                var value = values[index];
                AddParameter(command, $"field{index}", value.FieldName);
                AddParameter(command, $"table{index}", value.TableName);
                AddParameter(command, $"column{index}", value.ColumnName);
                AddParameter(command, $"value{index}", value.Value);
            }

            var lengths = new List<OracleColumnLength>(values.Count);
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                lengths.Add(new OracleColumnLength(
                    reader.GetString(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    string.Equals(reader.GetString(3), "C", StringComparison.Ordinal),
                    IsNullable(reader.GetString(4)),
                    Convert.ToInt32(reader.GetValue(5)),
                    reader.IsDBNull(6) ? null : Convert.ToInt32(reader.GetValue(6))));
            }

            if (lengths.Count != values.Count)
            {
                var found = lengths.Select(length => (length.TableName, length.ColumnName)).ToHashSet();
                var missing = values
                    .Where(value => !found.Contains((value.TableName, value.ColumnName)))
                    .Select(value => $"{value.TableName}.{value.ColumnName}");
                throw new InvalidOperationException(
                    $"Oracle column metadata is unavailable for: {string.Join(", ", missing)}.");
            }

            return lengths;
        }
        finally
        {
            if (openedHere)
            {
                await context.Database.CloseConnectionAsync();
            }
        }
    }

    private static string BuildQuery(int count)
    {
        var inputRows = Enumerable.Range(0, count)
            .Select(index =>
                $"SELECT :field{index} AS FIELD_NAME, :table{index} AS TABLE_NAME, :column{index} AS COLUMN_NAME, :value{index} AS FIELD_VALUE FROM DUAL");
        return $"""
            SELECT input.FIELD_NAME,
                   input.TABLE_NAME,
                   input.COLUMN_NAME,
                   metadata.CHAR_USED,
                   metadata.NULLABLE,
                   CASE WHEN metadata.CHAR_USED = 'C' THEN metadata.CHAR_LENGTH ELSE metadata.DATA_LENGTH END AS MAX_LENGTH,
                   CASE WHEN metadata.CHAR_USED = 'C' THEN LENGTH(input.FIELD_VALUE) ELSE LENGTHB(input.FIELD_VALUE) END AS ACTUAL_LENGTH
              FROM ({string.Join(" UNION ALL ", inputRows)}) input
              JOIN ALL_TAB_COLUMNS metadata
                ON metadata.OWNER = :owner
               AND metadata.TABLE_NAME = input.TABLE_NAME
               AND metadata.COLUMN_NAME = input.COLUMN_NAME
            """;
    }

    internal static bool IsNullable(string nullableFlag) =>
        string.Equals(nullableFlag, "Y", StringComparison.Ordinal);

    private static void AddParameter(System.Data.Common.DbCommand command, string name, string? value)
    {
        var parameter = new OracleParameter(name, OracleDbType.Varchar2)
        {
            Value = value is null ? DBNull.Value : value
        };
        command.Parameters.Add(parameter);
    }
}
