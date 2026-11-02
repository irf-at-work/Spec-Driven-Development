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

        var listItem = context.Model.FindEntityType(typeof(StdListItem));
        Assert.NotNull(listItem);
        Assert.Equal("STD_LIST_ITEM", listItem.GetTableName());
        Assert.Equal(
            new[] { nameof(StdListItem.LiType), nameof(StdListItem.LiCode) },
            listItem.FindPrimaryKey()!.Properties.Select(property => property.Name));

        var listItemTable = StoreObjectIdentifier.Table("STD_LIST_ITEM", "IIRIS_RD_DEVP");
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiType), "LI_TYPE", 20);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiCode), "LI_CODE", 12);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiDesc), "LI_DESC", 100);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiDescL2), "LI_DESC_L2", 100);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiShortDesc), "LI_SHORT_DESC", 30);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiShortDescL2), "LI_SHORT_DESC_L2", 30);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiValue), "LI_VALUE", 100);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiActiveYn), "LI_ACTIVE_YN", 1);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiFlex01), "LI_FLEX_01", 100);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiFlex02), "LI_FLEX_02", 100);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiCrBy), "LI_CR_BY", 12);
        AssertListItemProperty(listItem, listItemTable, nameof(StdListItem.LiUpBy), "LI_UP_BY", 12);
        Assert.Equal(
            "LI_CR_DT",
            listItem.FindProperty(nameof(StdListItem.LiCrDt))!.GetColumnName(listItemTable));
        Assert.Equal(
            "LI_UP_DT",
            listItem.FindProperty(nameof(StdListItem.LiUpDt))!.GetColumnName(listItemTable));
    }

    private static void AssertListItemProperty(
        IEntityType entity,
        StoreObjectIdentifier table,
        string propertyName,
        string columnName,
        int maxLength)
    {
        var property = entity.FindProperty(propertyName)!;
        Assert.Equal(columnName, property.GetColumnName(table));
        Assert.Equal(maxLength, property.GetMaxLength());
    }
}
