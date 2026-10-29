using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data.Scaffolded;

// Extends the generated context without editing it (constitution B8): re-scaffolding cannot overwrite this file.
public partial class SddDbContext
{
    // Intentionally empty. VMAK_ACTIVE_YN used to be marked database-supplied here, but the page now writes
    // Y or N itself (FR-027), so no override is needed. Put future hand-written model settings in this method.
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
    }
}
