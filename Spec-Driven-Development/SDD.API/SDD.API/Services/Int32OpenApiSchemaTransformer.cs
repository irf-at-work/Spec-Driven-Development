using System.Text.Json.Schema;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace SDD.API.Services;

public sealed class Int32OpenApiSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(
        OpenApiSchema schema,
        OpenApiSchemaTransformerContext context,
        CancellationToken cancellationToken)
    {
        var type = context.JsonTypeInfo?.Type;
        if (type is not null
            && (type == typeof(int) || Nullable.GetUnderlyingType(type) == typeof(int)))
        {
            schema.AnyOf = null;
            schema.Type = JsonSchemaType.Integer;
            schema.Format = "int32";
            schema.Pattern = null;
        }

        return Task.CompletedTask;
    }
}
