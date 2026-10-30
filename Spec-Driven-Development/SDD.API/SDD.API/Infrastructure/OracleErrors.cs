using Oracle.ManagedDataAccess.Client;

namespace SDD.API.Infrastructure;

/// <summary>Recognises specific Oracle errors so a database rule can be reported to the user in plain English.</summary>
public static class OracleErrors
{
    /// <summary>ORA-00001: a unique or primary key value already exists.</summary>
    public const int UniqueConstraintViolation = 1;

    /// <summary>ORA-02292: a parent row cannot be deleted because child rows still point to it.</summary>
    public const int ChildRecordFound = 2292;

    /// <summary>True when the exception, or anything it wraps, is the given Oracle error.</summary>
    public static bool Has(Exception exception, int oracleErrorNumber)
    {
        for (var current = exception; current is not null; current = current.InnerException)
        {
            if (current is OracleException oracleException && oracleException.Number == oracleErrorNumber)
            {
                return true;
            }
        }

        return false;
    }
}
