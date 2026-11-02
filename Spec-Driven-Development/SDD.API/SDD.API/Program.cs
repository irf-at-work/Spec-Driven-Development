using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SDD.API.Data;
using SDD.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0;
    options.AddSchemaTransformer<Int32OpenApiSchemaTransformer>();
});
builder.Services.AddCors(options => options.AddPolicy(
    "LocalAngular",
    policy => policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()));
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<CompanyService>();
builder.Services.AddSingleton(TimeProvider.System);

var brokerConnection = builder.Configuration.GetConnectionString("BrokerConnection");
if (string.IsNullOrWhiteSpace(brokerConnection))
{
    throw new InvalidOperationException(
        "The BrokerConnection connection string is missing. Set ConnectionStrings__BrokerConnection in the local environment.");
}

builder.Services.AddDbContext<BrokerDataContext>(options => options.UseOracle(brokerConnection, o =>
    o.UseOracleSQLCompatibility(OracleSQLCompatibility.DatabaseVersion19)));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("LocalAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();
