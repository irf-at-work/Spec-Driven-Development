using Microsoft.EntityFrameworkCore;
using SDD.API.Data;
using SDD.API.Middleware;
using SDD.API.Services;

var builder = WebApplication.CreateBuilder(args);

var codesMasterConnectionString =
    builder.Configuration.GetConnectionString("CodesMasterOracle");

if (string.IsNullOrWhiteSpace(codesMasterConnectionString))
{
    throw new InvalidOperationException(
        "The 'CodesMasterOracle' connection string is not configured.");
}

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Oracle Database
builder.Services.AddDbContext<CodesMasterContext>(options =>
    options.UseOracle(codesMasterConnectionString));

// Dependency Injection
builder.Services.AddScoped<ICodesRepository, CodesRepository>();
builder.Services.AddScoped<ICodesService, CodesService>();
builder.Services.AddSingleton<CodesFieldValidator>();

// Exception Handling
builder.Services.AddExceptionHandler<ProblemDetailsExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AngularPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();