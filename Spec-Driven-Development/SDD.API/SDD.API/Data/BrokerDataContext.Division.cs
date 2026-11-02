using Microsoft.EntityFrameworkCore;
using SDD.API.Data.Entities;

namespace SDD.API.Data;

public partial class BrokerDataContext
{
    public virtual DbSet<StdDivision> StdDivisions { get; set; }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StdDivision>(entity =>
        {
            entity.HasKey(division => new { division.DivnCompCode, division.DivnCode });

            entity.ToTable("STD_DIVISION");

            entity.Property(division => division.DivnCompCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DIVN_COMP_CODE");
            entity.Property(division => division.DivnCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DIVN_CODE");
            entity.Property(division => division.DivnActiveYn)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("DIVN_ACTIVE_YN");
            entity.Property(division => division.DivnAddr1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_ADDR1");
            entity.Property(division => division.DivnAddr1L2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_ADDR1_L2");
            entity.Property(division => division.DivnAddr2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_ADDR2");
            entity.Property(division => division.DivnAddr2L2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_ADDR2_L2");
            entity.Property(division => division.DivnAddr3)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_ADDR3");
            entity.Property(division => division.DivnAddr3L2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_ADDR3_L2");
            entity.Property(division => division.DivnCrBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DIVN_CR_BY");
            entity.Property(division => division.DivnCrDt)
                .HasColumnType("DATE")
                .HasColumnName("DIVN_CR_DT");
            entity.Property(division => division.DivnCrNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("DIVN_CR_NO");
            entity.Property(division => division.DivnEmail)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_EMAIL");
            entity.Property(division => division.DivnFax)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("DIVN_FAX");
            entity.Property(division => division.DivnIncharge)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("DIVN_INCHARGE");
            entity.Property(division => division.DivnInchargeL2)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("DIVN_INCHARGE_L2");
            entity.Property(division => division.DivnLicenseExpDt)
                .HasColumnType("DATE")
                .HasColumnName("DIVN_LICENSE_EXP_DT");
            entity.Property(division => division.DivnLicenseIssDt)
                .HasColumnType("DATE")
                .HasColumnName("DIVN_LICENSE_ISS_DT");
            entity.Property(division => division.DivnMobile)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("DIVN_MOBILE");
            entity.Property(division => division.DivnName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_NAME");
            entity.Property(division => division.DivnNameL2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DIVN_NAME_L2");
            entity.Property(division => division.DivnPhone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("DIVN_PHONE");
            entity.Property(division => division.DivnRemarks)
                .IsUnicode(false)
                .HasColumnName("DIVN_REMARKS");
            entity.Property(division => division.DivnShortName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DIVN_SHORT_NAME");
            entity.Property(division => division.DivnShortNameL2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DIVN_SHORT_NAME_L2");
            entity.Property(division => division.DivnUpBy)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DIVN_UP_BY");
            entity.Property(division => division.DivnUpDt)
                .HasColumnType("DATE")
                .HasColumnName("DIVN_UP_DT");
        });
    }
}
