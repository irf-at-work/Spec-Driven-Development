using Microsoft.EntityFrameworkCore;
using SDD.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var brokerConnection = builder.Configuration.GetConnectionString("BrokerConnection");
if (string.IsNullOrWhiteSpace(brokerConnection))
{
    throw new InvalidOperationException(
        "The BrokerConnection connection string is missing. Set ConnectionStrings__BrokerConnection in the local environment.");
}

builder.Services.AddDbContext<BrokerDataContext>(options => options.UseOracle(brokerConnection));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
