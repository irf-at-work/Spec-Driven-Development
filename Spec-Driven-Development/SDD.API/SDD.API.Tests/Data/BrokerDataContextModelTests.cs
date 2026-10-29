using Microsoft.EntityFrameworkCore;
using SDD.API.Data;

namespace SDD.API.Tests.Data;

public sealed class BrokerDataContextModelTests
{
    [Fact]
    public void Maps_only_the_three_scaffolded_master_tables()
    {
        using var context = new BrokerDataContext(
            new DbContextOptionsBuilder<BrokerDataContext>()
                .UseOracle("Data Source=localhost:1521/FREEPDB1")
                .Options);

        var mappings = context.Model.GetEntityTypes()
            .Select(entity => new
            {
                Table = entity.GetTableName(),
                Schema = entity.GetSchema(),
            })
            .ToArray();

        Assert.Equal(3, mappings.Length);
        Assert.Equal(
            new[] { "STD_COMPANY", "STD_DEPARTMENT", "STD_LIST_ITEM" },
            mappings.Select(mapping => mapping.Table).OrderBy(table => table, StringComparer.Ordinal));
        Assert.All(mappings, mapping => Assert.Equal("IIRIS_RD_DEVP", mapping.Schema));
    }
}
