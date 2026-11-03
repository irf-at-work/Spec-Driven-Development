using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data;

public partial class CodesMasterContext
{
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<STD_CODES>()
            .Property(record => record.CC_CR_DT)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("SYSDATE");

        modelBuilder.Entity<STD_DOCUMENT>(entity =>
        {
            entity.ToTable("STD_DOCUMENT", "IIRIS_RD_DEVP");
            entity.HasKey(record => record.DOC_CODE);
            entity.Property(record => record.DOC_CODE)
                .HasColumnType("VARCHAR2(12 BYTE)")
                .HasMaxLength(12)
                .IsUnicode(false)
                .ValueGeneratedNever();
            entity.Property(record => record.DOC_NAME).HasColumnType("VARCHAR2(100 BYTE)").HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.DOC_NAME_L2).HasColumnType("VARCHAR2(100 BYTE)").HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.DOC_DESC).HasColumnType("VARCHAR2(2000 BYTE)").HasMaxLength(2000).IsUnicode(false);
            entity.Property(record => record.DOC_DESC_L2).HasColumnType("VARCHAR2(2000 BYTE)").HasMaxLength(2000).IsUnicode(false);
            entity.Property(record => record.DOC_SETUP_FOR).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DOC_ACTIVE_YN).HasColumnType("VARCHAR2(1 BYTE)").HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.DOC_FLEX_01).HasColumnType("VARCHAR2(60 BYTE)").HasMaxLength(60).IsUnicode(false);
            entity.Property(record => record.DOC_FLEX_02).HasColumnType("VARCHAR2(60 BYTE)").HasMaxLength(60).IsUnicode(false);
            entity.Property(record => record.DOC_CR_BY).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DOC_CR_DT).HasColumnType("DATE");
            entity.Property(record => record.DOC_UP_BY).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DOC_UP_DT).HasColumnType("DATE");
        });

        modelBuilder.Entity<STD_DOC_APPL_MODULE>(entity =>
        {
            entity.ToTable("STD_DOC_APPL_MODULE", "IIRIS_RD_DEVP");
            entity.HasKey(record => record.DAMOD_UID);
            entity.Property(record => record.DAMOD_UID)
                .HasColumnType("NUMBER")
                .ValueGeneratedNever();
            entity.Property(record => record.DAMOD_DOC_CODE).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_APPL_FOR).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_PROD_CODE_FM).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_PROD_CODE_TO).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_PCM_CODE_FM).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_PCM_CODE_TO).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_CCM_CODE_FM).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_CCM_CODE_TO).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_DOC_MAND_YN).HasColumnType("VARCHAR2(1 BYTE)").HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.DAMOD_ACTIVE_YN).HasColumnType("VARCHAR2(1 BYTE)").HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.DAMOD_CR_BY).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_CR_DT).HasColumnType("DATE");
            entity.Property(record => record.DAMOD_UP_BY).HasColumnType("VARCHAR2(12 BYTE)").HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.DAMOD_UP_DT).HasColumnType("DATE");
        });
    }
}
