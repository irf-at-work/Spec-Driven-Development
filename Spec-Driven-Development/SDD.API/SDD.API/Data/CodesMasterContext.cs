using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data;

public partial class CodesMasterContext : DbContext
{
    public CodesMasterContext(DbContextOptions<CodesMasterContext> options)
        : base(options)
    {
    }

    public virtual DbSet<STD_CODES> STD_CODES { get; set; }
    public virtual DbSet<STD_DOCUMENT> STD_DOCUMENT { get; set; }
    public virtual DbSet<STD_DOC_APPL_MODULE> STD_DOC_APPL_MODULE { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasDefaultSchema("IIRIS_RD_DEVP")
            .UseCollation("USING_NLS_COMP");

        modelBuilder.Entity<STD_CODES>(entity =>
        {
            entity.HasKey(e => new { e.CC_CODE, e.CC_TYPE });

            entity.Property(e => e.CC_CODE)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CC_TYPE)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CC_ACTIVE_YN)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.CC_COMP_CODE)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CC_CR_BY)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CC_CR_DT).HasColumnType("DATE");
            entity.Property(e => e.CC_DESC)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CC_DESC_L2)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CC_FLEX_01)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.CC_FLEX_02)
                .HasMaxLength(2000)
                .IsUnicode(false);
            entity.Property(e => e.CC_LONG_DESC)
                .HasMaxLength(2000)
                .IsUnicode(false);
            entity.Property(e => e.CC_LONG_DESC_L2)
                .HasMaxLength(2000)
                .IsUnicode(false);
            entity.Property(e => e.CC_SHORT_DESC)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.CC_SHORT_DESC_L2)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.CC_UP_BY)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CC_UP_DT).HasColumnType("DATE");
            entity.Property(e => e.CC_VALUE1)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CC_VALUE2)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
