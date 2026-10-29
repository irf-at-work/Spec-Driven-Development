using System.Diagnostics;
using System.Text;

namespace SDD.API.E2E.Tests.Fixtures;

public sealed class DashboardUiFixture : IAsyncLifetime
{
    private readonly StringBuilder _output = new();
    private Process? _server;

    public Uri BaseAddress { get; } = new("http://127.0.0.1:4200");

    public async Task InitializeAsync()
    {
        var frontendDirectory = FindFrontendDirectory();
        var startInfo = CreateStartInfo(frontendDirectory);

        _server = new Process { StartInfo = startInfo };
        _server.OutputDataReceived += (_, args) => AppendOutput(args.Data);
        _server.ErrorDataReceived += (_, args) => AppendOutput(args.Data);

        if (!_server.Start())
        {
            throw new InvalidOperationException("The Angular development server did not start.");
        }

        _server.BeginOutputReadLine();
        _server.BeginErrorReadLine();

        using var client = new HttpClient();
        for (var attempt = 0; attempt < 120; attempt++)
        {
            if (_server.HasExited)
            {
                throw new InvalidOperationException(
                    $"The Angular development server exited with code {_server.ExitCode}.{Environment.NewLine}{GetOutput()}");
            }

            try
            {
                using var response = await client.GetAsync(BaseAddress);
                if (response.IsSuccessStatusCode)
                {
                    return;
                }
            }
            catch (HttpRequestException)
            {
            }

            await Task.Delay(TimeSpan.FromSeconds(1));
        }

        throw new TimeoutException(
            $"The Angular development server did not become ready at {BaseAddress}.{Environment.NewLine}{GetOutput()}");
    }

    public async Task DisposeAsync()
    {
        if (_server is { HasExited: false })
        {
            _server.Kill(entireProcessTree: true);
            await _server.WaitForExitAsync();
        }

        _server?.Dispose();
    }

    private void AppendOutput(string? line)
    {
        if (line is null)
        {
            return;
        }

        lock (_output)
        {
            _output.AppendLine(line);
        }
    }

    private string GetOutput()
    {
        lock (_output)
        {
            return _output.ToString();
        }
    }

    private static string FindFrontendDirectory()
    {
        for (var directory = new DirectoryInfo(AppContext.BaseDirectory); directory is not null; directory = directory.Parent)
        {
            var candidate = Path.Combine(directory.FullName, "sdd-ui");
            if (File.Exists(Path.Combine(candidate, "package.json")))
            {
                return candidate;
            }
        }

        throw new DirectoryNotFoundException("Could not locate the sdd-ui frontend project.");
    }

    private static ProcessStartInfo CreateStartInfo(string frontendDirectory)
    {
        var startInfo = new ProcessStartInfo
        {
            FileName = "node",
            WorkingDirectory = frontendDirectory,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
        };

        startInfo.ArgumentList.Add(Path.Combine(frontendDirectory, "node_modules", "@angular", "cli", "bin", "ng.js"));
        startInfo.ArgumentList.Add("serve");
        startInfo.ArgumentList.Add("--host");
        startInfo.ArgumentList.Add("127.0.0.1");
        startInfo.ArgumentList.Add("--port");
        startInfo.ArgumentList.Add("4200");

        return startInfo;
    }
}
