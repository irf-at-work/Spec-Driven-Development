using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SDD.API.Infrastructure;

public sealed class ProblemDetailsExceptionHandler(
    ILogger<ProblemDetailsExceptionHandler> logger,
    IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // A browser that closes the page mid-request is not a server fault, so it is not reported as one.
        if (exception is OperationCanceledException && httpContext.RequestAborted.IsCancellationRequested)
        {
            logger.LogInformation(
                "Request was cancelled by the client: {Method} {Path}",
                httpContext.Request.Method,
                httpContext.Request.Path);
            return true;
        }

        // The full exception is logged here only. The client receives a fixed, safe message with no stack trace.
        logger.LogError(
            exception,
            "Unhandled error ({ErrorCategory}) while processing {Method} {Path}",
            exception.GetType().Name,
            httpContext.Request.Method,
            httpContext.Request.Path);

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Something went wrong",
                Detail = "The request could not be completed. Please try again, and contact support if the problem continues."
            }
        });
    }
}
