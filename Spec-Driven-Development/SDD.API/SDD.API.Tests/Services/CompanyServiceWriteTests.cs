using SDD.API.Data.Entities;
using SDD.API.Contracts;
using SDD.API.Services;

namespace SDD.API.Tests.Services;

public sealed class CompanyServiceWriteTests
{
    [Fact]
    public async Task Creates_company_with_default_short_name_and_audit_values()
    {
        var repository = new FakeCompanyRepository();
        var now = new DateTimeOffset(2026, 10, 29, 12, 0, 0, TimeSpan.Zero);
        var service = new CompanyService(repository, new FixedTimeProvider(now));

        var result = await service.CreateAsync(new CreateCompanyRequest
        {
            CompanyCode = "NEW",
            CompanyName = "A company name that is longer than thirty characters",
        }, CancellationToken.None);

        var row = Assert.Single(repository.CompanyRows);
        Assert.Equal("A company name that is longer ", row.CompShortName);
        Assert.Equal("Admin", result.CreatedBy);
        Assert.Equal(now.UtcDateTime, result.CreatedAt);
        Assert.Equal("Admin", result.LastUpdatedBy);
        Assert.Equal(now.UtcDateTime, result.LastUpdatedAt);
        Assert.Equal(1, repository.SaveCount);
    }

    [Fact]
    public async Task Rejects_duplicate_code_and_invalid_required_or_length_values()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.Add(new() { CompCode = "DUP", CompName = "Existing" });
        var service = new CompanyService(repository);

        await Assert.ThrowsAsync<CompanyConflictException>(
            () => service.CreateAsync(new CreateCompanyRequest
            {
                CompanyCode = "DUP",
                CompanyName = "Duplicate",
            }, CancellationToken.None));

        var error = await Assert.ThrowsAsync<CompanyValidationException>(
            () => service.CreateAsync(new CreateCompanyRequest
            {
                CompanyCode = "TOO-LONG-COMPANY",
                CompanyName = new string('N', 101),
                ShortName = new string('S', 31),
                Address1 = new string('1', 101),
                Address2 = new string('2', 101),
                Address3 = new string('3', 101),
                ReferenceNumber = new string('R', 21),
                CompanyInCharge = new string('I', 61),
                Phone = new string('P', 21),
                Email = new string('e', 101),
                Website = new string('W', 101),
            }, CancellationToken.None));

        Assert.Contains("companyCode", error.Errors.Keys);
        Assert.Contains("companyName", error.Errors.Keys);
        Assert.Contains("shortName", error.Errors.Keys);
        Assert.Contains("address1", error.Errors.Keys);
        Assert.Contains("address2", error.Errors.Keys);
        Assert.Contains("address3", error.Errors.Keys);
        Assert.Contains("referenceNumber", error.Errors.Keys);
        Assert.Contains("companyInCharge", error.Errors.Keys);
        Assert.Contains("phone", error.Errors.Keys);
        Assert.Contains("email", error.Errors.Keys);
        Assert.Contains("website", error.Errors.Keys);
        Assert.Single(repository.CompanyRows);
        Assert.Equal(0, repository.SaveCount);
    }

    [Fact]
    public async Task Updates_only_mutable_fields_and_last_valid_update_wins()
    {
        var repository = new FakeCompanyRepository();
        repository.CompanyRows.Add(new StdCompany
        {
            CompCode = "KEEP",
            CompName = "Immutable name",
            CompShortName = "Old",
            CompRemarks = "preserve",
            CompNameL2 = "localized",
            CompCrBy = "Original",
        });
        var firstSaveTime = new DateTimeOffset(2026, 10, 29, 12, 0, 0, TimeSpan.Zero);
        var service = new CompanyService(repository, new FixedTimeProvider(firstSaveTime));

        await service.UpdateAsync("KEEP", new UpdateCompanyRequest { ShortName = "First" }, CancellationToken.None);
        var latestTime = firstSaveTime.AddMinutes(1);
        service = new CompanyService(repository, new FixedTimeProvider(latestTime));
        var updated = await service.UpdateAsync(
            "KEEP",
            new UpdateCompanyRequest { ShortName = "Latest", Phone = "123" },
            CancellationToken.None);

        Assert.NotNull(updated);
        var row = Assert.Single(repository.CompanyRows);
        Assert.Equal("Immutable name", row.CompName);
        Assert.Equal("KEEP", row.CompCode);
        Assert.Equal("Latest", row.CompShortName);
        Assert.Equal("123", row.CompPhone);
        Assert.Equal("preserve", row.CompRemarks);
        Assert.Equal("localized", row.CompNameL2);
        Assert.Equal("Original", row.CompCrBy);
        Assert.Equal(latestTime.UtcDateTime, updated.LastUpdatedAt);
        Assert.Equal("Admin", row.CompUpBy);
        Assert.Equal(2, repository.SaveCount);
    }

    private sealed class FixedTimeProvider(DateTimeOffset utcNow) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => utcNow;
    }
}
