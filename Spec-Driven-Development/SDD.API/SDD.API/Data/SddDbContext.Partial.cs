using Microsoft.EntityFrameworkCore;
using SDD.API.Data.ClaimConfigurations;

namespace SDD.API.Data.Scaffolded;

// Extends the generated context without editing it (constitution B8): re-scaffolding cannot overwrite this file.
public partial class SddDbContext
{
    public virtual DbSet<BrmClmConfig> BrmClmConfigs { get; set; } = null!;

    public virtual DbSet<BrmCcmProd> BrmCcmProds { get; set; } = null!;

    public virtual DbSet<BrmMiscCode> BrmMiscCodes { get; set; }

    // Keep hand-written mappings outside the generated context so future scaffolding cannot overwrite them.
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BrmClmConfig>(entity =>
        {
            entity.HasKey(row => new { row.CcmCompCode, row.CcmCode });
            entity.ToTable("BRM_CLM_CONFIG");
            entity.Property(row => row.CcmCompCode).HasMaxLength(12).IsUnicode(false).HasColumnName("CCM_COMP_CODE");
            entity.Property(row => row.CcmCode).HasMaxLength(12).IsUnicode(false).HasColumnName("CCM_CODE");
            entity.Property(row => row.CcmName).HasMaxLength(100).IsUnicode(false).HasColumnName("CCM_NAME");
            entity.Property(row => row.CcmShortName).HasMaxLength(30).IsUnicode(false).HasColumnName("CCM_SHORT_NAME");
            entity.Property(row => row.CcmNameL2).HasMaxLength(100).IsUnicode(false).HasColumnName("CCM_NAME_L2");
            entity.Property(row => row.CcmShortNameL2).HasMaxLength(30).IsUnicode(false).HasColumnName("CCM_SHORT_NAME_L2");
            entity.Property(row => row.CcmModule).HasMaxLength(2).IsUnicode(false).HasColumnName("CCM_MODULE");
            entity.Property(row => row.CcmAcntPostingType).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_ACNT_POSTING_TYPE");
            entity.Property(row => row.CcmAcntExchRateType).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_ACNT_EXCH_RATE_TYPE");
            entity.Property(row => row.CcmRoundType).HasMaxLength(2).IsUnicode(false).HasColumnName("CCM_ROUND_TYPE");
            entity.Property(row => row.CcmRoundValue).HasPrecision(8, 5).HasColumnName("CCM_ROUND_VALUE");
            entity.Property(row => row.CcmApplCurrType).HasMaxLength(2).IsUnicode(false).HasColumnName("CCM_APPL_CURR_TYPE");
            entity.Property(row => row.CcmDfltEstCloReasonCode).HasMaxLength(12).IsUnicode(false).HasColumnName("CCM_DFLT_EST_CLO_REASON_CODE");
            entity.Property(row => row.CcmDfltRecvDeduCode).HasMaxLength(12).IsUnicode(false).HasColumnName("CCM_DFLT_RECV_DEDU_CODE");
            entity.Property(row => row.CcmPrntBefApprYn).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_PRNT_BEF_APPR_YN");
            entity.Property(row => row.CcmRePrntYn).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_RE_PRNT_YN");
            entity.Property(row => row.CcmClmAcntDocGenYn).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_CLM_ACNT_DOC_GEN_YN");
            entity.Property(row => row.CcmClmCoinsAcntDocGenYn).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_CLM_COINS_ACNT_DOC_GEN_YN");
            entity.Property(row => row.CcmActiveYn).HasMaxLength(1).IsUnicode(false).HasColumnName("CCM_ACTIVE_YN");
            entity.Property(row => row.CcmCrBy).HasMaxLength(12).IsUnicode(false).HasColumnName("CCM_CR_BY");
            entity.Property(row => row.CcmCrDt).HasColumnType("DATE").HasColumnName("CCM_CR_DT");
            entity.Property(row => row.CcmUpBy).HasMaxLength(12).IsUnicode(false).HasColumnName("CCM_UP_BY");
            entity.Property(row => row.CcmUpDt).HasColumnType("DATE").HasColumnName("CCM_UP_DT");
        });

        modelBuilder.Entity<BrmCcmProd>(entity =>
        {
            entity.HasKey(row => new { row.CcmpCcmCode, row.CcmpCode });
            entity.ToTable("BRM_CCM_PROD");
            entity.Property(row => row.CcmpCcmCode).HasMaxLength(12).IsUnicode(false).HasColumnName("CCMP_CCM_CODE");
            entity.Property(row => row.CcmpCode).HasMaxLength(12).IsUnicode(false).HasColumnName("CCMP_CODE");
            entity.Property(row => row.CcmpCrBy).HasMaxLength(12).IsUnicode(false).HasColumnName("CCMP_CR_BY");
            entity.Property(row => row.CcmpCrDt).HasColumnType("DATE").HasColumnName("CCMP_CR_DT");
            entity.Property(row => row.CcmpUpBy).HasMaxLength(12).IsUnicode(false).HasColumnName("CCMP_UP_BY");
            entity.Property(row => row.CcmpUpDt).HasColumnType("DATE").HasColumnName("CCMP_UP_DT");
        });

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
