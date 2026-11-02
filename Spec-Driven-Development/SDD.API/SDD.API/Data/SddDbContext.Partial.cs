using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data.Scaffolded;

// Extends the generated context without editing it (constitution B8): re-scaffolding cannot overwrite this file.
public partial class SddDbContext
{
    public virtual DbSet<BrmMiscCode> BrmMiscCodes { get; set; }

    // Keep hand-written mappings outside the generated context so future scaffolding cannot overwrite them.
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BrmMiscCode>(entity =>
        {
            entity.HasKey(e => new { e.McCode, e.McCompCode, e.McType });
            entity.ToTable("BRM_MISC_CODES");

            entity.Property(e => e.McCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_CODE");
            entity.Property(e => e.McCompCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_COMP_CODE");
            entity.Property(e => e.McType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_TYPE");
            entity.Property(e => e.McActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("MC_ACTIVE_YN");
            entity.Property(e => e.McChgCateg)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_CHG_CATEG");
            entity.Property(e => e.McChgType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_CHG_TYPE");
            entity.Property(e => e.McCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_CR_BY");
            entity.Property(e => e.McCrDt)
                .HasColumnType("DATE")
                .HasColumnName("MC_CR_DT");
            entity.Property(e => e.McDesc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MC_DESC");
            entity.Property(e => e.McDescL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MC_DESC_L2");
            entity.Property(e => e.McDiscType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_DISC_TYPE");
            entity.Property(e => e.McFlex01)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("MC_FLEX_01");
            entity.Property(e => e.McLongDesc)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("MC_LONG_DESC");
            entity.Property(e => e.McLongDescL2)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("MC_LONG_DESC_L2");
            entity.Property(e => e.McShortDesc)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("MC_SHORT_DESC");
            entity.Property(e => e.McShortDescL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("MC_SHORT_DESC_L2");
            entity.Property(e => e.McUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("MC_UP_BY");
            entity.Property(e => e.McUpDt)
                .HasColumnType("DATE")
                .HasColumnName("MC_UP_DT");
        });
    }
}
