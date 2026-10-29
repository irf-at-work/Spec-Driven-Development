using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data.Scaffolded;

// Extends the generated context without editing it (constitution B8): re-scaffolding cannot overwrite this file.
public partial class SddDbContext
{
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        // This feature never reads or writes VMAK_ACTIVE_YN (owner decision, data-model.md). Marking it as
        // database-supplied makes EF leave it out of INSERT statements, so any database default still applies.
        modelBuilder.Entity<BrmVehMake>().Property(make => make.VmakActiveYn).ValueGeneratedOnAdd();
    }
}
