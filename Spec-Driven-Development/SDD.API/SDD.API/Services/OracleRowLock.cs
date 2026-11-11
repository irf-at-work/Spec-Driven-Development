using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SDD.API.Data;

namespace SDD.API.Services;

internal static class OracleRowLock
{
    public static Task<bool> LockDocumentAsync(
        CodesMasterContext context,
        string docCode,
        CancellationToken cancellationToken) =>
        LockAsync(
            context,
            "SELECT DOC_CODE FROM IIRIS_RD_DEVP.STD_DOCUMENT WHERE DOC_CODE = :docCode FOR UPDATE",
            ("docCode", docCode),
            cancellationToken);

    public static Task<bool> LockApplicableModuleAsync(
        CodesMasterContext context,
        string docCode,
        decimal damodUid,
        CancellationToken cancellationToken) =>
        LockAsync(
            context,
            "SELECT DAMOD_UID FROM IIRIS_RD_DEVP.STD_DOC_APPL_MODULE WHERE DAMOD_DOC_CODE = :docCode AND DAMOD_UID = :damodUid FOR UPDATE",
            ("docCode", docCode),
            ("damodUid", damodUid),
            cancellationToken);

    public static Task<bool> LockClaimConfigurationAsync(
        CodesMasterContext context,
        string ccmCode,
        CancellationToken cancellationToken) =>
        LockAsync(
            context,
            "SELECT CCM_CODE FROM IIRIS_RD_DEVP.BRM_CLM_CONFIG WHERE CCM_CODE = :ccmCode FOR UPDATE",
            ("ccmCode", ccmCode),
            cancellationToken);

    public static Task<bool> LockApplicableProductAsync(
        CodesMasterContext context,
        string ccmCode,
        string productCode,
        CancellationToken cancellationToken) =>
        LockAsync(
            context,
            "SELECT CCMP_CODE FROM IIRIS_RD_DEVP.BRM_CCM_PROD WHERE CCMP_CCM_CODE = :ccmCode AND CCMP_CODE = :productCode FOR UPDATE",
            ("ccmCode", ccmCode),
            ("productCode", productCode),
            cancellationToken);

    private static async Task<bool> LockAsync(
        CodesMasterContext context,
        string commandText,
        (string Name, object Value) firstParameter,
        CancellationToken cancellationToken) =>
        await LockAsync(context, commandText, [firstParameter], cancellationToken);

    private static async Task<bool> LockAsync(
        CodesMasterContext context,
        string commandText,
        (string Name, object Value) firstParameter,
        (string Name, object Value) secondParameter,
        CancellationToken cancellationToken) =>
        await LockAsync(context, commandText, [firstParameter, secondParameter], cancellationToken);

    private static async Task<bool> LockAsync(
        CodesMasterContext context,
        string commandText,
        IReadOnlyList<(string Name, object Value)> parameters,
        CancellationToken cancellationToken)
    {
        await using var command = context.Database.GetDbConnection().CreateCommand();
        command.CommandText = commandText;
        command.Transaction = context.Database.CurrentTransaction?.GetDbTransaction()
            ?? throw new InvalidOperationException("The row lock requires an active database transaction.");

        foreach (var (name, value) in parameters)
        {
            var parameter = command.CreateParameter();
            parameter.ParameterName = name;
            parameter.DbType = value is decimal ? DbType.Decimal : DbType.String;
            parameter.Value = value;
            command.Parameters.Add(parameter);
        }

        return await command.ExecuteScalarAsync(cancellationToken) is not null;
    }
}
