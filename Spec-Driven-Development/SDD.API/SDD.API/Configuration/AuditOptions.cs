using System.ComponentModel.DataAnnotations;

namespace SDD.API.Configuration;

/// <summary>
/// Who is recorded as the creator or last editor of a record (the "by" columns).
/// Sign-in is out of scope for now (constitution B9), so one fixed name is used until it arrives.
/// </summary>
public sealed class AuditOptions
{
    public const string SectionName = "Audit";

    /// <summary>Default "admin". The name saved in the created-by and changed-by columns; the database allows 12 characters.</summary>
    [Required]
    [MaxLength(12)]
    public string UserName { get; init; } = "admin";
}
