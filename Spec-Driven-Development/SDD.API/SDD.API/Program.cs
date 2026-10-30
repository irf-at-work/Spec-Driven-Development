using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using SDD.API.Configuration;
using SDD.API.Data.Scaffolded;
using SDD.API.Infrastructure;
using SDD.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Every log line carries a date and time so that actions and failures can be traced afterwards.
builder.Logging.AddSimpleConsole(options =>
{
    options.SingleLine = true;
    options.TimestampFormat = "dd-MMM-yyyy HH:mm:ss ";
});

// Stop at start-up with a clear instruction, rather than failing later on the first database call.
var oracleConnectionString = builder.Configuration.GetConnectionString("SddOracle");
if (string.IsNullOrWhiteSpace(oracleConnectionString))
{
    throw new InvalidOperationException(
        "The Oracle connection string 'ConnectionStrings:SddOracle' is not set. "
        + "Store it with: dotnet user-secrets set \"ConnectionStrings:SddOracle\" \"<your connection string>\". "
        + "appsettings.Example.json shows the expected format.");
}

// The Angular page runs on its own address, so the browser only lets it call this API if that address is listed here.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
if (allowedOrigins is null || allowedOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "No allowed web addresses are set in 'Cors:AllowedOrigins'. Add the address of the Angular app, "
        + "for example http://localhost:4200, to appsettings.json.");
}

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    // Gives every operation a stable name such as "VehicleMakes_List", so the generated Angular client has predictable method names.
    options.AddOperationTransformer((operation, context, _) =>
    {
        if (context.Description.ActionDescriptor is ControllerActionDescriptor action)
        {
            operation.OperationId = $"{action.ControllerName}_{action.ActionName}";
        }

        return Task.CompletedTask;
    });
});
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ProblemDetailsExceptionHandler>();
builder.Services.AddDbContext<SddDbContext>(options => options.UseOracle(oracleConnectionString));
builder.Services.AddScoped<VehicleMakeService>();
builder.Services.AddScoped<VehicleModelService>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy => policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

// Checked at start-up, so a bad setting stops the API with a clear message instead of failing on the first save.
builder.Services.AddOptions<AuditOptions>()
    .BindConfiguration(AuditOptions.SectionName)
    .ValidateDataAnnotations()
    .ValidateOnStart();

var app = builder.Build();

// Configure the HTTP request pipeline.
// CORS comes first so that even an error response still carries the headers the browser needs to read it.
app.UseCors();
app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

// Lets the integration tests start the whole API in memory.
public partial class Program { }
