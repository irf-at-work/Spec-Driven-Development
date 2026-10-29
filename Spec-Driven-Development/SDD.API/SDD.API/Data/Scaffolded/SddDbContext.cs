using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data.Scaffolded;

public partial class SddDbContext : DbContext
{
    public SddDbContext(DbContextOptions<SddDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BrmVehMake> BrmVehMakes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasDefaultSchema("IIRIS_RD_DEVP")
            .UseCollation("USING_NLS_COMP");

        modelBuilder.Entity<BrmVehMake>(entity =>
        {
            entity.HasKey(e => e.VmakCode);

            entity.ToTable("BRM_VEH_MAKE");

            entity.Property(e => e.VmakCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMAK_CODE");
            entity.Property(e => e.VmakActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("VMAK_ACTIVE_YN");
            entity.Property(e => e.VmakCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMAK_CR_BY");
            entity.Property(e => e.VmakCrDt)
                .HasColumnType("DATE")
                .HasColumnName("VMAK_CR_DT");
            entity.Property(e => e.VmakName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("VMAK_NAME");
            entity.Property(e => e.VmakNameL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("VMAK_NAME_L2");
            entity.Property(e => e.VmakRemarks)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("VMAK_REMARKS");
            entity.Property(e => e.VmakRemarksL2)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("VMAK_REMARKS_L2");
            entity.Property(e => e.VmakShortName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("VMAK_SHORT_NAME");
            entity.Property(e => e.VmakShortNameL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("VMAK_SHORT_NAME_L2");
            entity.Property(e => e.VmakUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMAK_UP_BY");
            entity.Property(e => e.VmakUpDt)
                .HasColumnType("DATE")
                .HasColumnName("VMAK_UP_DT");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
