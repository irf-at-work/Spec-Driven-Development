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

    public virtual DbSet<BrmVehModel> BrmVehModels { get; set; }

    public virtual DbSet<StdListItem> StdListItems { get; set; }

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
                .HasDefaultValueSql("'Y'")
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

        modelBuilder.Entity<BrmVehModel>(entity =>
        {
            entity.HasKey(e => new { e.VmodVmakCode, e.VmodCode });

            entity.ToTable("BRM_VEH_MODEL");

            entity.Property(e => e.VmodVmakCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_VMAK_CODE");
            entity.Property(e => e.VmodCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_CODE");
            entity.Property(e => e.VmodActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("VMOD_ACTIVE_YN");
            entity.Property(e => e.VmodBodyColor)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_BODY_COLOR");
            entity.Property(e => e.VmodBodyType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_BODY_TYPE");
            entity.Property(e => e.VmodCatgCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_CATG_CODE");
            entity.Property(e => e.VmodCc)
                .HasColumnType("NUMBER")
                .HasColumnName("VMOD_CC");
            entity.Property(e => e.VmodCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_CR_BY");
            entity.Property(e => e.VmodCrDt)
                .HasColumnType("DATE")
                .HasColumnName("VMOD_CR_DT");
            entity.Property(e => e.VmodCylinder)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_CYLINDER");
            entity.Property(e => e.VmodDoors)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_DOORS");
            entity.Property(e => e.VmodDrivingType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_DRIVING_TYPE");
            entity.Property(e => e.VmodFuelType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_FUEL_TYPE");
            entity.Property(e => e.VmodLoadCapacity)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("VMOD_LOAD_CAPACITY");
            entity.Property(e => e.VmodMakeYear)
                .HasColumnType("NUMBER")
                .HasColumnName("VMOD_MAKE_YEAR");
            entity.Property(e => e.VmodName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("VMOD_NAME");
            entity.Property(e => e.VmodNameL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("VMOD_NAME_L2");
            entity.Property(e => e.VmodNoDrvr)
                .HasPrecision(3)
                .HasColumnName("VMOD_NO_DRVR");
            entity.Property(e => e.VmodNoPass)
                .HasPrecision(3)
                .HasColumnName("VMOD_NO_PASS");
            entity.Property(e => e.VmodNoSeats)
                .HasPrecision(3)
                .HasColumnName("VMOD_NO_SEATS");
            entity.Property(e => e.VmodRemarks)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("VMOD_REMARKS");
            entity.Property(e => e.VmodRemarksL2)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("VMOD_REMARKS_L2");
            entity.Property(e => e.VmodShortName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("VMOD_SHORT_NAME");
            entity.Property(e => e.VmodShortNameL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("VMOD_SHORT_NAME_L2");
            entity.Property(e => e.VmodType)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_TYPE");
            entity.Property(e => e.VmodUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_UP_BY");
            entity.Property(e => e.VmodUpDt)
                .HasColumnType("DATE")
                .HasColumnName("VMOD_UP_DT");
            entity.Property(e => e.VmodValueLc)
                .HasColumnType("NUMBER")
                .HasColumnName("VMOD_VALUE_LC");
            entity.Property(e => e.VmodVariant)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("VMOD_VARIANT");
            entity.Property(e => e.VmodWeight)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("VMOD_WEIGHT");

            entity.HasOne(d => d.VmodVmakCodeNavigation).WithMany(p => p.BrmVehModels)
                .HasForeignKey(d => d.VmodVmakCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BRM_VEH_MODEL_01");
        });

        modelBuilder.Entity<StdListItem>(entity =>
        {
            entity.HasKey(e => new { e.LiType, e.LiCode });

            entity.ToTable("STD_LIST_ITEM");

            entity.Property(e => e.LiType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("LI_TYPE");
            entity.Property(e => e.LiCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("LI_CODE");
            entity.Property(e => e.LiActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("LI_ACTIVE_YN");
            entity.Property(e => e.LiCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("LI_CR_BY");
            entity.Property(e => e.LiCrDt)
                .HasColumnType("DATE")
                .HasColumnName("LI_CR_DT");
            entity.Property(e => e.LiDesc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("LI_DESC");
            entity.Property(e => e.LiDescL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("LI_DESC_L2");
            entity.Property(e => e.LiFlex01)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("LI_FLEX_01");
            entity.Property(e => e.LiFlex02)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("LI_FLEX_02");
            entity.Property(e => e.LiShortDesc)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LI_SHORT_DESC");
            entity.Property(e => e.LiShortDescL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LI_SHORT_DESC_L2");
            entity.Property(e => e.LiUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("LI_UP_BY");
            entity.Property(e => e.LiUpDt)
                .HasColumnType("DATE")
                .HasColumnName("LI_UP_DT");
            entity.Property(e => e.LiValue)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("LI_VALUE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
