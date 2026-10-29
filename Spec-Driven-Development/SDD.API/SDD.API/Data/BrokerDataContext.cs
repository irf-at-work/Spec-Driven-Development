using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SDD.API.Data.Entities;

namespace SDD.API.Data;

public partial class BrokerDataContext : DbContext
{
    public BrokerDataContext(DbContextOptions<BrokerDataContext> options)
        : base(options)
    {
    }

    public virtual DbSet<StdCompany> StdCompanies { get; set; }

    public virtual DbSet<StdDepartment> StdDepartments { get; set; }

    public virtual DbSet<StdListItem> StdListItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasDefaultSchema("IIRIS_RD_DEVP")
            .UseCollation("USING_NLS_COMP");

        modelBuilder.Entity<StdCompany>(entity =>
        {
            entity.HasKey(e => e.CompCode);

            entity.ToTable("STD_COMPANY");

            entity.Property(e => e.CompCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("COMP_CODE");
            entity.Property(e => e.CompActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("COMP_ACTIVE_YN");
            entity.Property(e => e.CompAddr1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_ADDR1");
            entity.Property(e => e.CompAddr1L2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_ADDR1_L2");
            entity.Property(e => e.CompAddr2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_ADDR2");
            entity.Property(e => e.CompAddr2L2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_ADDR2_L2");
            entity.Property(e => e.CompAddr3)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_ADDR3");
            entity.Property(e => e.CompAddr3L2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_ADDR3_L2");
            entity.Property(e => e.CompAmlRegId)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("COMP_AML_REG_ID");
            entity.Property(e => e.CompBaseCurrCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("COMP_BASE_CURR_CODE");
            entity.Property(e => e.CompCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("COMP_CR_BY");
            entity.Property(e => e.CompCrDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_CR_DT");
            entity.Property(e => e.CompCrNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("COMP_CR_NO");
            entity.Property(e => e.CompCtlAcntCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("COMP_CTL_ACNT_CODE");
            entity.Property(e => e.CompEmail)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_EMAIL");
            entity.Property(e => e.CompFax)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("COMP_FAX");
            entity.Property(e => e.CompIaRegId)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("COMP_IA_REG_ID");
            entity.Property(e => e.CompIncharge)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("COMP_INCHARGE");
            entity.Property(e => e.CompInchargeL2)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("COMP_INCHARGE_L2");
            entity.Property(e => e.CompIncorpDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_INCORP_DT");
            entity.Property(e => e.CompLicenseExpDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_LICENSE_EXP_DT");
            entity.Property(e => e.CompLicenseIssDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_LICENSE_ISS_DT");
            entity.Property(e => e.CompMobile)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("COMP_MOBILE");
            entity.Property(e => e.CompName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_NAME");
            entity.Property(e => e.CompNameL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_NAME_L2");
            entity.Property(e => e.CompPhone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("COMP_PHONE");
            entity.Property(e => e.CompRefNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("COMP_REF_NO");
            entity.Property(e => e.CompRemarks)
                .IsUnicode(false)
                .HasColumnName("COMP_REMARKS");
            entity.Property(e => e.CompShortName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("COMP_SHORT_NAME");
            entity.Property(e => e.CompShortNameL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("COMP_SHORT_NAME_L2");
            entity.Property(e => e.CompUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("COMP_UP_BY");
            entity.Property(e => e.CompUpDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_UP_DT");
            entity.Property(e => e.CompVatEffDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_VAT_EFF_DT");
            entity.Property(e => e.CompVatExpDt)
                .HasColumnType("DATE")
                .HasColumnName("COMP_VAT_EXP_DT");
            entity.Property(e => e.CompVatLocation)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("COMP_VAT_LOCATION");
            entity.Property(e => e.CompVatRegnNo)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("COMP_VAT_REGN_NO");
            entity.Property(e => e.CompWebsite)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("COMP_WEBSITE");
        });

        modelBuilder.Entity<StdDepartment>(entity =>
        {
            entity.HasKey(e => new { e.DeptCompCode, e.DeptDivnCode, e.DeptCode });

            entity.ToTable("STD_DEPARTMENT");

            entity.Property(e => e.DeptCompCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DEPT_COMP_CODE");
            entity.Property(e => e.DeptDivnCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DEPT_DIVN_CODE");
            entity.Property(e => e.DeptCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DEPT_CODE");
            entity.Property(e => e.DeptActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("DEPT_ACTIVE_YN");
            entity.Property(e => e.DeptCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DEPT_CR_BY");
            entity.Property(e => e.DeptCrDt)
                .HasColumnType("DATE")
                .HasColumnName("DEPT_CR_DT");
            entity.Property(e => e.DeptIncharge)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("DEPT_INCHARGE");
            entity.Property(e => e.DeptInchargeL2)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("DEPT_INCHARGE_L2");
            entity.Property(e => e.DeptName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DEPT_NAME");
            entity.Property(e => e.DeptNameL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DEPT_NAME_L2");
            entity.Property(e => e.DeptRemarks)
                .IsUnicode(false)
                .HasColumnName("DEPT_REMARKS");
            entity.Property(e => e.DeptShortName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DEPT_SHORT_NAME");
            entity.Property(e => e.DeptShortNameL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DEPT_SHORT_NAME_L2");
            entity.Property(e => e.DeptUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DEPT_UP_BY");
            entity.Property(e => e.DeptUpDt)
                .HasColumnType("DATE")
                .HasColumnName("DEPT_UP_DT");
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
