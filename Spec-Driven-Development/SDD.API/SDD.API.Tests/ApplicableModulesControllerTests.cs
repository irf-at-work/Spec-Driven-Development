using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Contracts;
using SDD.API.Data;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class ApplicableModulesControllerTests
{
    [Theory]
    [InlineData(CodeSortDirection.Ascending, "ASSET", "BILL")]
    [InlineData(CodeSortDirection.Descending, "BILL", "ASSET")]
    public void Query_sorts_applicable_modules_before_paging(
        CodeSortDirection direction,
        string firstApplicableFor,
        string lastApplicableFor)
    {
        var modules = new[]
        {
            new STD_DOC_APPL_MODULE { DAMOD_UID = 3, DAMOD_APPL_FOR = "BILL" },
            new STD_DOC_APPL_MODULE { DAMOD_UID = 1, DAMOD_APPL_FOR = "ASSET" },
            new STD_DOC_APPL_MODULE { DAMOD_UID = 2, DAMOD_APPL_FOR = "ASSET" },
        };

        var sorted = ApplicableModuleQuery.ApplySort(
                modules.AsQueryable(),
                ApplicableModuleSortColumn.ApplicableFor,
                direction)
            .ToArray();

        Assert.Equal(firstApplicableFor, sorted[0].DAMOD_APPL_FOR);
        Assert.Equal(lastApplicableFor, sorted[2].DAMOD_APPL_FOR);
        Assert.Equal(
            new decimal[] { 1, 2 },
            sorted.Where(module => module.DAMOD_APPL_FOR == "ASSET").Select(module => module.DAMOD_UID));
    }

    [Fact]
    public void Validator_requires_applicable_for_and_enforces_code_byte_limits()
    {
        var validator = new ApplicableModuleValidator();
        var requiredErrors = validator.Validate(new ApplicableModuleWriteRequest());
        var lengthErrors = validator.Validate(new ApplicableModuleWriteRequest
        {
            ApplicableFor = "ASSET",
            ProductFrom = new string('ش', 13),
            PcmTo = new string('ش', 13),
            CcmFrom = new string('ش', 13),
            MandatoryYn = "YY",
            ActiveYn = "X",
        });
        var configuredCodeErrors = validator.Validate(new ApplicableModuleWriteRequest
        {
            ApplicableFor = "CUSTOM",
        });

        Assert.Contains("applicableFor", requiredErrors.Keys);
        Assert.Contains("productFrom", lengthErrors.Keys);
        Assert.Contains("pcmTo", lengthErrors.Keys);
        Assert.Contains("ccmFrom", lengthErrors.Keys);
        Assert.Contains("mandatoryYn", lengthErrors.Keys);
        Assert.Contains("activeYn", lengthErrors.Keys);
        Assert.DoesNotContain("applicableFor", configuredCodeErrors.Keys);
    }

    [Fact]
    public async Task Create_defaults_audit_and_flags_and_preserves_range_codes_for_configured_types()
    {
        var systemDate = new DateTime(2026, 11, 3, 10, 15, 0);
        var repository = new FakeApplicableModulesRepository { SystemDate = systemDate };
        var service = CreateService(repository);

        var record = await service.CreateAsync(
            "DOC-1",
            new ApplicableModuleWriteRequest
            {
                ApplicableFor = "FIXED_ASSET",
                ProductFrom = "1001",
                ProductTo = "1002",
                PcmFrom = "101",
                PcmTo = "201",
                CcmFrom = "101",
                CcmTo = "601",
            },
            default);

        Assert.Equal("1", record.DamodUid);
        Assert.Equal("DOC-1", record.DamodDocCode);
        Assert.Equal("FIXED_ASSET", record.ApplicableFor);
        Assert.Equal("1001", record.ProductFrom);
        Assert.Equal("1002", record.ProductTo);
        Assert.Equal("101", record.PcmFrom);
        Assert.Equal("201", record.PcmTo);
        Assert.Equal("101", record.CcmFrom);
        Assert.Equal("601", record.CcmTo);
        Assert.Equal("N", record.MandatoryYn);
        Assert.Equal("Y", record.ActiveYn);
        Assert.Equal("ADMIN", record.CreatedBy);
        Assert.Equal(systemDate, record.CreatedDate);
        Assert.Null(record.UpdatedBy);
        Assert.Null(record.UpdatedDate);
    }

    [Fact]
    public async Task Create_preserves_option_codes_and_allows_duplicate_applicable_for_rows()
    {
        var repository = new FakeApplicableModulesRepository();
        var service = CreateService(repository);
        var request = new ApplicableModuleWriteRequest
        {
            ApplicableFor = "ASSET",
            ProductFrom = "1002",
            ProductTo = "2001",
            PcmFrom = "301",
            PcmTo = "101",
            CcmFrom = "601",
            CcmTo = "201",
        };

        var first = await service.CreateAsync("DOC-1", request, default);
        var second = await service.CreateAsync("DOC-1", request, default);

        Assert.Equal("1002", first.ProductFrom);
        Assert.Equal("2001", first.ProductTo);
        Assert.Equal("301", first.PcmFrom);
        Assert.Equal("101", first.PcmTo);
        Assert.Equal("601", first.CcmFrom);
        Assert.Equal("201", first.CcmTo);
        Assert.NotEqual(first.DamodUid, second.DamodUid);
        Assert.Equal("ASSET", second.ApplicableFor);
    }

    [Fact]
    public async Task Get_and_list_keep_child_rows_scoped_to_the_parent()
    {
        var first = new STD_DOC_APPL_MODULE
        {
            DAMOD_UID = 10,
            DAMOD_DOC_CODE = "DOC-1",
            DAMOD_APPL_FOR = "ASR",
        };
        var otherParent = new STD_DOC_APPL_MODULE
        {
            DAMOD_UID = 11,
            DAMOD_DOC_CODE = "DOC-2",
            DAMOD_APPL_FOR = "ASSET",
        };
        var service = CreateService(new FakeApplicableModulesRepository { Modules = [first, otherParent] });

        var listed = await service.ListAsync(
            "DOC-1",
            1,
            10,
            [],
            ApplicableModuleSortColumn.DamodUid,
            CodeSortDirection.Ascending,
            default);
        var found = await service.GetAsync("DOC-2", 11, default);
        var mismatched = await service.GetAsync("DOC-1", 11, default);

        Assert.Single(listed.Items);
        Assert.Equal("10", listed.Items[0].DamodUid);
        Assert.NotNull(found);
        Assert.Equal("DOC-2", found!.DamodDocCode);
        Assert.Null(mismatched);
    }

    [Theory]
    [InlineData(CodeFilterOperator.StartsWith, "ASR", "1")]
    [InlineData(CodeFilterOperator.EndsWith, "SET", "2")]
    [InlineData(CodeFilterOperator.Contains, "sSe", "2")]
    [InlineData(CodeFilterOperator.DoesNotContain, "sSe", "1")]
    [InlineData(CodeFilterOperator.EqualTo, "asset", "2")]
    [InlineData(CodeFilterOperator.NotEqualTo, "asset", "1")]
    public void Filter_operators_match_case_insensitively(
        CodeFilterOperator filterOperator,
        string value,
        string expectedId)
    {
        var modules = new[]
        {
            new STD_DOC_APPL_MODULE { DAMOD_UID = 1, DAMOD_APPL_FOR = "ASR" },
            new STD_DOC_APPL_MODULE { DAMOD_UID = 2, DAMOD_APPL_FOR = "ASSET" },
        };

        var result = ApplicableModuleQuery.ApplyFilter(
                modules.AsQueryable(),
                [new ApplicableModuleFilter(
                    ApplicableModuleFilterColumn.ApplicableFor,
                    filterOperator,
                    value)])
            .Select(module => module.DAMOD_UID.ToString())
            .Single();

        Assert.Equal(expectedId, result);
    }

    [Theory]
    [InlineData(ApplicableModuleFilterColumn.ApplicableFor, "ASSET")]
    [InlineData(ApplicableModuleFilterColumn.ProductFrom, "1001")]
    [InlineData(ApplicableModuleFilterColumn.ProductTo, "1002")]
    [InlineData(ApplicableModuleFilterColumn.PcmFrom, "101")]
    [InlineData(ApplicableModuleFilterColumn.PcmTo, "201")]
    [InlineData(ApplicableModuleFilterColumn.CcmFrom, "301")]
    [InlineData(ApplicableModuleFilterColumn.CcmTo, "401")]
    [InlineData(ApplicableModuleFilterColumn.MandatoryYn, "Y")]
    [InlineData(ApplicableModuleFilterColumn.ActiveYn, "N")]
    public void Filter_supports_every_applicable_module_column(
        ApplicableModuleFilterColumn column,
        string value)
    {
        var module = new STD_DOC_APPL_MODULE
        {
            DAMOD_APPL_FOR = "ASSET",
            DAMOD_PROD_CODE_FM = "1001",
            DAMOD_PROD_CODE_TO = "1002",
            DAMOD_PCM_CODE_FM = "101",
            DAMOD_PCM_CODE_TO = "201",
            DAMOD_CCM_CODE_FM = "301",
            DAMOD_CCM_CODE_TO = "401",
            DAMOD_DOC_MAND_YN = "Y",
            DAMOD_ACTIVE_YN = "N",
        };

        var result = ApplicableModuleQuery.ApplyFilter(
            new[] { module }.AsQueryable(),
            [new ApplicableModuleFilter(column, CodeFilterOperator.EqualTo, value)]);

        Assert.Single(result);
    }

    [Fact]
    public void Filter_combines_all_column_filters_with_and()
    {
        var modules = new[]
        {
            new STD_DOC_APPL_MODULE
            {
                DAMOD_UID = 1,
                DAMOD_APPL_FOR = "ASSET",
                DAMOD_PROD_CODE_FM = "1001",
            },
            new STD_DOC_APPL_MODULE
            {
                DAMOD_UID = 2,
                DAMOD_APPL_FOR = "ASSET",
                DAMOD_PROD_CODE_FM = "1002",
            },
        };

        var result = ApplicableModuleQuery.ApplyFilter(
            modules.AsQueryable(),
            [
                new ApplicableModuleFilter(
                    ApplicableModuleFilterColumn.ApplicableFor,
                    CodeFilterOperator.EqualTo,
                    "ASSET"),
                new ApplicableModuleFilter(
                    ApplicableModuleFilterColumn.ProductFrom,
                    CodeFilterOperator.EqualTo,
                    "1001"),
            ]);

        Assert.Equal(1, Assert.Single(result).DAMOD_UID);
    }

    [Fact]
    public async Task Update_keeps_identity_and_creation_audit_and_clears_ranges_when_changed_to_asr()
    {
        var createdDate = new DateTime(2026, 10, 1, 8, 0, 0);
        var updateDate = new DateTime(2026, 11, 3, 10, 15, 0);
        var module = new STD_DOC_APPL_MODULE
        {
            DAMOD_UID = 98_765_432_109_876_543m,
            DAMOD_DOC_CODE = "DOC-1",
            DAMOD_APPL_FOR = "ASSET",
            DAMOD_PROD_CODE_FM = "1001",
            DAMOD_PROD_CODE_TO = "1002",
            DAMOD_PCM_CODE_FM = "101",
            DAMOD_PCM_CODE_TO = "201",
            DAMOD_CCM_CODE_FM = "101",
            DAMOD_CCM_CODE_TO = "601",
            DAMOD_DOC_MAND_YN = "N",
            DAMOD_ACTIVE_YN = "Y",
            DAMOD_CR_BY = "ORIGINAL",
            DAMOD_CR_DT = createdDate,
        };
        var repository = new FakeApplicableModulesRepository
        {
            SystemDate = updateDate,
            Modules = [module],
        };
        var service = CreateService(repository);

        var result = await service.UpdateAsync(
            "DOC-1",
            module.DAMOD_UID,
            new ApplicableModuleUpdateRequest
            {
                ApplicableFor = "FIXED_ASSET",
                ProductFrom = "1001",
                ProductTo = "1002",
                PcmFrom = "101",
                PcmTo = "201",
                CcmFrom = "101",
                CcmTo = "601",
                ExpectedVersion = DocumentSetupVersion.Create(module),
            },
            default);

        Assert.NotNull(result);
        Assert.Equal("98765432109876543", result!.DamodUid);
        Assert.Equal("DOC-1", result.DamodDocCode);
        Assert.Equal("FIXED_ASSET", result.ApplicableFor);
        Assert.Equal("1001", result.ProductFrom);
        Assert.Equal("1002", result.ProductTo);
        Assert.Equal("101", result.PcmFrom);
        Assert.Equal("201", result.PcmTo);
        Assert.Equal("101", result.CcmFrom);
        Assert.Equal("601", result.CcmTo);
        Assert.Equal("ORIGINAL", result.CreatedBy);
        Assert.Equal(createdDate, result.CreatedDate);
        Assert.Equal("ADMIN", result.UpdatedBy);
        Assert.Equal(updateDate, result.UpdatedDate);
    }

    [Fact]
    public async Task Update_rejects_stale_version_and_does_not_change_the_row()
    {
        var module = new STD_DOC_APPL_MODULE
        {
            DAMOD_UID = 1,
            DAMOD_DOC_CODE = "DOC-1",
            DAMOD_APPL_FOR = "ASR",
        };
        var service = CreateService(new FakeApplicableModulesRepository { Modules = [module] });

        var exception = await Assert.ThrowsAsync<CodesApiException>(() => service.UpdateAsync(
            "DOC-1",
            1,
            new ApplicableModuleUpdateRequest
            {
                ApplicableFor = "ASSET",
                ExpectedVersion = "stale-version",
            },
            default));

        Assert.Equal(409, exception.StatusCode);
        Assert.Contains("reload", exception.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Equal("ASR", module.DAMOD_APPL_FOR);
    }

    [Fact]
    public async Task Delete_removes_only_the_selected_child_and_rejects_stale_versions()
    {
        var first = new STD_DOC_APPL_MODULE
        {
            DAMOD_UID = 1,
            DAMOD_DOC_CODE = "DOC-1",
            DAMOD_APPL_FOR = "ASR",
        };
        var second = new STD_DOC_APPL_MODULE
        {
            DAMOD_UID = 2,
            DAMOD_DOC_CODE = "DOC-1",
            DAMOD_APPL_FOR = "ASSET",
        };
        var repository = new FakeApplicableModulesRepository { Modules = [first, second] };
        var service = CreateService(repository);

        var exception = await Assert.ThrowsAsync<CodesApiException>(() =>
            service.DeleteAsync("DOC-1", 1, "stale-version", default));
        var deleted = await service.DeleteAsync(
            "DOC-1",
            1,
            DocumentSetupVersion.Create(first),
            default);

        Assert.Equal(409, exception.StatusCode);
        Assert.True(deleted);
        Assert.Single(repository.Modules);
        Assert.Equal(2, repository.Modules[0].DAMOD_UID);
    }

    [Fact]
    public async Task Create_requires_an_existing_parent()
    {
        var service = CreateService(new FakeApplicableModulesRepository { ParentExists = false });

        var exception = await Assert.ThrowsAsync<CodesApiException>(() => service.CreateAsync(
            "MISSING",
            new ApplicableModuleWriteRequest { ApplicableFor = "ASR" },
            default));

        Assert.Equal(404, exception.StatusCode);
    }

    private static ApplicableModulesService CreateService(FakeApplicableModulesRepository repository) =>
        new(repository, new ApplicableModuleValidator(), NullLogger<ApplicableModulesService>.Instance);

    private sealed class FakeApplicableModulesRepository : IApplicableModulesRepository
    {
        public bool ParentExists { get; init; } = true;
        public DateTime SystemDate { get; init; } = new(2026, 11, 3);
        public decimal NextId { get; private set; } = 1;
        public List<STD_DOC_APPL_MODULE> Modules { get; init; } = [];

        public Task<bool> ParentExistsAsync(string docCode, CancellationToken cancellationToken) =>
            Task.FromResult(ParentExists);

        public Task<int> CountAsync(
            string docCode,
            IReadOnlyList<ApplicableModuleFilter> filters,
            CancellationToken cancellationToken) =>
            Task.FromResult(ApplicableModuleQuery.ApplyFilter(
                    Modules.Where(module => module.DAMOD_DOC_CODE == docCode).AsQueryable(),
                    filters)
                .Count());

        public Task<IReadOnlyList<STD_DOC_APPL_MODULE>> GetPageAsync(
            string docCode,
            int skip,
            int pageSize,
            IReadOnlyList<ApplicableModuleFilter> filters,
            ApplicableModuleSortColumn sortBy,
            CodeSortDirection sortDirection,
            CancellationToken cancellationToken)
        {
            var matches = ApplicableModuleQuery.ApplyFilter(
                Modules.Where(module => module.DAMOD_DOC_CODE == docCode).AsQueryable(),
                filters);
            var ordered = ApplicableModuleQuery.ApplySort(matches, sortBy, sortDirection)
                .Skip(skip)
                .Take(pageSize)
                .ToArray();
            return Task.FromResult<IReadOnlyList<STD_DOC_APPL_MODULE>>(ordered);
        }

        public Task<DateTime> GetSystemDateAsync(CancellationToken cancellationToken) =>
            Task.FromResult(SystemDate);

        public Task<STD_DOC_APPL_MODULE?> FindAsync(
            string docCode,
            decimal damodUid,
            CancellationToken cancellationToken) =>
            Task.FromResult(Modules.SingleOrDefault(module =>
                module.DAMOD_DOC_CODE == docCode && module.DAMOD_UID == damodUid));

        public Task<STD_DOC_APPL_MODULE?> CreateWithNextIdAsync(
            STD_DOC_APPL_MODULE module,
            CancellationToken cancellationToken)
        {
            if (!ParentExists)
            {
                return Task.FromResult<STD_DOC_APPL_MODULE?>(null);
            }

            module.DAMOD_UID = NextId++;
            Modules.Add(module);
            return Task.FromResult<STD_DOC_APPL_MODULE?>(module);
        }

        public async Task<STD_DOC_APPL_MODULE?> UpdateIfCurrentAsync(
            string docCode,
            decimal damodUid,
            string expectedVersion,
            Func<STD_DOC_APPL_MODULE, CancellationToken, Task> update,
            CancellationToken cancellationToken)
        {
            var module = await FindAsync(docCode, damodUid, cancellationToken);
            if (module is null)
            {
                return null;
            }

            if (!string.Equals(DocumentSetupVersion.Create(module), expectedVersion, StringComparison.Ordinal))
            {
                throw new CodesApiException(
                    409,
                    "The Applicable Module has changed.",
                    "Reload the Applicable Module before saving your changes.");
            }

            await update(module, cancellationToken);
            return module;
        }

        public async Task<bool> DeleteIfCurrentAsync(
            string docCode,
            decimal damodUid,
            string expectedVersion,
            CancellationToken cancellationToken)
        {
            var module = await FindAsync(docCode, damodUid, cancellationToken);
            if (module is null)
            {
                return false;
            }

            if (!string.Equals(DocumentSetupVersion.Create(module), expectedVersion, StringComparison.Ordinal))
            {
                throw new CodesApiException(
                    409,
                    "The Applicable Module has changed.",
                    "Reload the Applicable Module before deleting it.");
            }

            Modules.Remove(module);
            return true;
        }
    }
}
