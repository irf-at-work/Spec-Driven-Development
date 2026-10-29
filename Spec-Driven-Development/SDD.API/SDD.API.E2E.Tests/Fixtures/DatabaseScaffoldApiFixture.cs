using System.Diagnostics;
using System.Net;
using System.Text;

namespace SDD.API.E2E.Tests.Fixtures;

public sealed class DatabaseScaffoldApiFixture : IAsyncLifetime
{
    private const int Port = 5180;
    private const string BaseUrl = "http://127.0.0.1:5180";
    private readonly StringBuilder _output = new();
    private Process? _server;

    public Uri BaseAddress { get; } = new(BaseUrl);

    public bool IsRunning => _server is { HasExited: false };

    public async Task InitializeAsync()
    {
        var projectPath = FindApiProject();
        var startInfo = CreateStartInfo(projectPath);

        _server = new Process { StartInfo = startInfo };
        _server.OutputDataReceived += (_, args) => AppendOutput(args.Data);
        _server.ErrorDataReceived += (_, args) => AppendOutput(args.Data);

        if (!_server.Start())
        {
            throw new InvalidOperationException("The API test host did not start.");
        }

        _server.BeginOutputReadLine();
        _server.BeginErrorReadLine();

        using var handler = new HttpClientHandler { AllowAutoRedirect = false };
        using var client = new HttpClient(handler);
        for (var attempt = 0; attempt < 30; attempt++)
        {
            if (_server.HasExited)
            {
                throw new InvalidOperationException(
                    $"The API test host exited with code {_server.ExitCode}.{Environment.NewLine}{GetOutput()}");
            }

            try
            {
                using var response = await client.GetAsync(BaseAddress);
                if ((int)response.StatusCode < 500)
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
            $"The API test host did not become ready at {BaseAddress}.{Environment.NewLine}{GetOutput()}");
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

    private static string FindApiProject()
    {
        for (var directory = new DirectoryInfo(AppContext.BaseDirectory); directory is not null; directory = directory.Parent)
        {
            var candidate = Path.Combine(directory.FullName, "SDD.API", "SDD.API", "SDD.API.csproj");
            if (File.Exists(candidate))
            {
                return candidate;
            }
        }

        throw new DirectoryNotFoundException("Could not locate the SDD.API project.");
    }

    private static ProcessStartInfo CreateStartInfo(string projectPath)
    {
        var projectDirectory = Path.GetDirectoryName(projectPath)
            ?? throw new InvalidOperationException("The API project directory could not be determined.");
        var startInfo = new ProcessStartInfo
        {
            FileName = "dotnet",
            WorkingDirectory = projectDirectory,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
        };

        startInfo.ArgumentList.Add("run");
        startInfo.ArgumentList.Add("--no-build");
        startInfo.ArgumentList.Add("--configuration");
        startInfo.ArgumentList.Add("Release");
        startInfo.ArgumentList.Add("--project");
        startInfo.ArgumentList.Add(projectPath);
        startInfo.ArgumentList.Add("--");
        startInfo.ArgumentList.Add("--urls");
        startInfo.ArgumentList.Add(BaseUrl);

        startInfo.Environment["ASPNETCORE_ENVIRONMENT"] = "Development";
        startInfo.Environment["ConnectionStrings__BrokerConnection"] =
            "Data Source=localhost:1521/FREEPDB1";

        return startInfo;
    }
}
