using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using SDD.API.Middleware;
using SDD.API.Services;

namespace SDD.API.Tests;

public sealed class ProblemDetailsExceptionHandlerTests
{
    [Fact]
    public async Task TryHandleAsync_IncludesFieldErrorsInValidationResponse()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        var handler = new ProblemDetailsExceptionHandler(
            NullLogger<ProblemDetailsExceptionHandler>.Instance);
        var exception = new CodesApiException(
            StatusCodes.Status400BadRequest,
            "The submitted claim configuration is not valid.",
            "Correct the highlighted fields and try again.",
            new Dictionary<string, string[]>
            {
                ["ccmName"] = ["This field cannot exceed 100 bytes."]
            });

        var handled = await handler.TryHandleAsync(
            context,
            exception,
            CancellationToken.None);

        Assert.True(handled);
        context.Response.Body.Position = 0;
        using var response = await JsonDocument.ParseAsync(context.Response.Body);
        Assert.Equal(
            "This field cannot exceed 100 bytes.",
            response.RootElement
                .GetProperty("errors")
                .GetProperty("ccmName")[0]
                .GetString());
    }
}
