namespace SDD.API.Services;

public sealed class CodesApiException(
    int statusCode,
    string title,
    string detail,
    IReadOnlyDictionary<string, string[]>? errors = null) : Exception(detail)
{
    public int StatusCode { get; } = statusCode;
    public string Title { get; } = title;
    public IReadOnlyDictionary<string, string[]>? Errors { get; } = errors;
}
