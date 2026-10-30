using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SDD.API.Services;

namespace SDD.API.Middleware;

public sealed class ProblemDetailsExceptionHandler(
    ILogger<ProblemDetailsExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var traceId = httpContext.TraceIdentifier;
        var statusCode = exception is CodesApiException codesException
            ? codesException.StatusCode
            : StatusCodes.Status500InternalServerError;
        var title = exception is CodesApiException knownException
            ? knownException.Title
            : "An unexpected error occurred.";
        var detail = exception is CodesApiException detailException
            ? detailException.Message
            : "Please try again. If the problem continues, contact support with the reference number.";

        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            logger.LogError(
                exception,
                "Unhandled exception for {Method} {Path}. Trace ID: {TraceId}",
                httpContext.Request.Method,
                httpContext.Request.Path,
                traceId);
        }
        else
        {
            logger.LogWarning(
                "Request failed with status {StatusCode} at {Method} {Path}. Trace ID: {TraceId}",
                statusCode,
                httpContext.Request.Method,
                httpContext.Request.Path,
                traceId);
        }

        ProblemDetails problemDetails;
        if (exception is CodesApiException { Errors: not null } validationException)
        {
            var validationProblem = new ValidationProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = httpContext.Request.Path
            };
            foreach (var (field, messages) in validationException.Errors)
            {
                validationProblem.Errors.Add(field, messages);
            }

            problemDetails = validationProblem;
        }
        else
        {
            problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = httpContext.Request.Path
            };
        }
        problemDetails.Extensions["traceId"] = traceId;

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/problem+json";
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}
