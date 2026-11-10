using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class OracleColumnLengthValidatorTests
{
    [Theory]
    [InlineData("Y", true)]
    [InlineData("N", false)]
    public void IsNullable_matches_oracle_metadata_flag(string nullableFlag, bool expected)
    {
        Assert.Equal(expected, OracleColumnLengthValidator.IsNullable(nullableFlag));
    }
}
