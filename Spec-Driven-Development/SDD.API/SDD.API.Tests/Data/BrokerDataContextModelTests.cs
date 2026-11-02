using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SDD.API.Data;
using SDD.API.Data.Entities;

namespace SDD.API.Tests.Data;

public sealed class BrokerDataContextModelTests
{
    [Fact]
    public void Maps_only_the_scaffolded_master_tables_including_division()
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

        Assert.Equal(4, mappings.Length);
        Assert.Equal(
            new[] { "STD_COMPANY", "STD_DEPARTMENT", "STD_DIVISION", "STD_LIST_ITEM" },
            mappings.Select(mapping => mapping.Table).OrderBy(table => table, StringComparer.Ordinal));
        Assert.All(mappings, mapping => Assert.Equal("IIRIS_RD_DEVP", mapping.Schema));

        var division = context.Model.FindEntityType(typeof(StdDivision));
        Assert.NotNull(division);
        Assert.Equal("STD_DIVISION", division.GetTableName());
        Assert.Equal(
            new[] { nameof(StdDivision.DivnCompCode), nameof(StdDivision.DivnCode) },
            division.FindPrimaryKey()!.Properties.Select(property => property.Name));

        var divisionTable = StoreObjectIdentifier.Table("STD_DIVISION", "IIRIS_RD_DEVP");
        Assert.Equal("DIVN_COMP_CODE", division.FindProperty(nameof(StdDivision.DivnCompCode))!
            .GetColumnName(divisionTable));
        Assert.Equal("DIVN_CODE", division.FindProperty(nameof(StdDivision.DivnCode))!
            .GetColumnName(divisionTable));
        Assert.Equal(12, division.FindProperty(nameof(StdDivision.DivnCompCode))!.GetMaxLength());
        Assert.Equal(100, division.FindProperty(nameof(StdDivision.DivnName))!.GetMaxLength());
    }
}
