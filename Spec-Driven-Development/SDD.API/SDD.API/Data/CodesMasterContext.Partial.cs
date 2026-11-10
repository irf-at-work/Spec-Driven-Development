using Microsoft.EntityFrameworkCore;

namespace SDD.API.Data;

public partial class CodesMasterContext
{
    public virtual DbSet<BRM_CLM_CONFIG> BRM_CLM_CONFIG { get; set; } = null!;
    public virtual DbSet<BRM_CCM_PROD> BRM_CCM_PROD { get; set; } = null!;
    public virtual DbSet<STD_LIST_ITEM> STD_LIST_ITEM { get; set; } = null!;

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BRM_CLM_CONFIG>(entity =>
        {
            entity.ToTable("BRM_CLM_CONFIG", "IIRIS_RD_DEVP");
            entity.HasKey(record => new { record.CCM_COMP_CODE, record.CCM_CODE });
            entity.HasIndex(record => record.CCM_CODE).IsUnique();
            entity.Property(record => record.CCM_COMP_CODE).HasMaxLength(12).IsUnicode(false).IsRequired();
            entity.Property(record => record.CCM_CODE).HasMaxLength(12).IsUnicode(false).IsRequired();
            entity.Property(record => record.CCM_NAME).HasMaxLength(100).IsUnicode(false).IsRequired();
            entity.Property(record => record.CCM_SHORT_NAME).HasMaxLength(30).IsUnicode(false);
            entity.Property(record => record.CCM_NAME_L2).HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.CCM_SHORT_NAME_L2).HasMaxLength(30).IsUnicode(false);
            entity.Property(record => record.CCM_MODULE).HasMaxLength(2).IsUnicode(false);
            entity.Property(record => record.CCM_ACNT_POSTING_TYPE).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_ACNT_EXCH_RATE_TYPE).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_ROUND_TYPE).HasMaxLength(2).IsUnicode(false);
            entity.Property(record => record.CCM_ROUND_VALUE).HasColumnType("NUMBER(8,5)");
            entity.Property(record => record.CCM_APPL_CURR_TYPE).HasMaxLength(2).IsUnicode(false);
            entity.Property(record => record.CCM_DFLT_EST_CLO_REASON_CODE).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.CCM_DFLT_RECV_DEDU_CODE).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.CCM_PRNT_BEF_APPR_YN).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_RE_PRNT_YN).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_CLM_ACNT_DOC_GEN_YN).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_CLM_COINS_ACNT_DOC_GEN_YN).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_ACTIVE_YN).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.CCM_CR_BY).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.CCM_CR_DT).HasColumnType("DATE");
            entity.Property(record => record.CCM_UP_BY).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.CCM_UP_DT).HasColumnType("DATE");
        });

        modelBuilder.Entity<BRM_CCM_PROD>(entity =>
        {
            entity.ToTable("BRM_CCM_PROD", "IIRIS_RD_DEVP");
            entity.HasKey(record => new { record.CCMP_CCM_CODE, record.CCMP_CODE });
            entity.Property(record => record.CCMP_CCM_CODE).HasMaxLength(12).IsUnicode(false).IsRequired();
            entity.Property(record => record.CCMP_CODE).HasMaxLength(12).IsUnicode(false).IsRequired();
            entity.Property(record => record.CCMP_CR_BY).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.CCMP_CR_DT).HasColumnType("DATE");
            entity.Property(record => record.CCMP_UP_BY).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.CCMP_UP_DT).HasColumnType("DATE");
        });

        modelBuilder.Entity<STD_LIST_ITEM>(entity =>
        {
            entity.HasNoKey();
            entity.ToTable("STD_LIST_ITEM", "IIRIS_RD_DEVP");
            entity.Property(record => record.LI_TYPE).HasMaxLength(20).IsUnicode(false);
            entity.Property(record => record.LI_CODE).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.LI_DESC).HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.LI_DESC_L2).HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.LI_SHORT_DESC).HasMaxLength(30).IsUnicode(false);
            entity.Property(record => record.LI_SHORT_DESC_L2).HasMaxLength(30).IsUnicode(false);
            entity.Property(record => record.LI_VALUE).HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.LI_ACTIVE_YN).HasMaxLength(1).IsUnicode(false);
            entity.Property(record => record.LI_CR_BY).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.LI_CR_DT).HasColumnType("DATE");
            entity.Property(record => record.LI_UP_BY).HasMaxLength(12).IsUnicode(false);
            entity.Property(record => record.LI_UP_DT).HasColumnType("DATE");
            entity.Property(record => record.LI_FLEX_01).HasMaxLength(100).IsUnicode(false);
            entity.Property(record => record.LI_FLEX_02).HasMaxLength(100).IsUnicode(false);
        });

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
