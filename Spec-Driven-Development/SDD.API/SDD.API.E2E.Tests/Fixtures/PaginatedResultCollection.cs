namespace SDD.API.E2E.Tests.Fixtures;

[CollectionDefinition(Name)]
public sealed class PaginatedResultCollection : ICollectionFixture<PaginatedResultTestHost>
{
    public const string Name = "Paginated result API";
}
