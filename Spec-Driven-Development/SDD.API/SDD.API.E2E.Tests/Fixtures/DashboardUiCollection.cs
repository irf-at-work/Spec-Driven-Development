namespace SDD.API.E2E.Tests.Fixtures;

[CollectionDefinition(Name)]
public sealed class DashboardUiCollection : ICollectionFixture<DashboardUiFixture>, ICollectionFixture<DatabaseScaffoldApiFixture>
{
    public const string Name = "Dashboard UI";
}
