namespace SDD.API.Services;

public sealed class CompanyValidationException(
    IReadOnlyDictionary<string, string[]> errors) : Exception("The company data is invalid.")
{
    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}

public sealed class CompanyConflictException(string message) : Exception(message)
{
}

public sealed class CompanyNotFoundException()
    : Exception("The requested company does not exist.");

public sealed class CompanyReferenceException()
    : Exception("This company cannot be deleted because it is referenced by other records.");
