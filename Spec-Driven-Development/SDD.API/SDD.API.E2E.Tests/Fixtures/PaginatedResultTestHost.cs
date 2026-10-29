using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;
using SDD.API.Common;

namespace SDD.API.E2E.Tests.Fixtures;

public sealed class PaginatedResultTestHost : IAsyncLifetime
{
    private WebApplication? _application;

    public Uri Address { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.ConfigureKestrel(options => options.Listen(IPAddress.Loopback, 0));
        var application = builder.Build();

        application.MapGet(
            "/paginated-result",
            (int page, int pageSize) =>
            {
                var items = page == 1 ? new[] { "First", "Second" } : Array.Empty<string>();
                return Results.Json(new PaginatedResult<string>
                {
                    Items = items,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = 2,
                });
            });

        await application.StartAsync();
        var addresses = application.Services
            .GetRequiredService<IServer>()
            .Features.Get<IServerAddressesFeature>()!
            .Addresses;

        Address = new Uri(addresses.Single());
        _application = application;
    }

    public async Task DisposeAsync()
    {
        if (_application is null)
        {
            return;
        }

        await _application.StopAsync();
        await _application.DisposeAsync();
    }
}
