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
    }
}
