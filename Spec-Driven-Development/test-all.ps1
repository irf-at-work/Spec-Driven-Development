<#
.SYNOPSIS
    The one command that checks everything: formatting, lint, API tests, Angular tests, production build and browser tests.

.DESCRIPTION
    Stops at the first failure. Run it from the repository root:  .\Spec-Driven-Development\test-all.ps1

    Needs the environment variable SDD_TEST_ORACLE_CONNECTION to hold the connection string of the owner-approved Oracle
    TEST schema. The tests create and delete rows whose codes start with ZT. The value is never printed.
    The browser tests start the API on https://localhost:7246 by themselves and stop it again at the end.
#>
$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$apiSolution = Join-Path $projectRoot 'SDD.API\SDD.API.slnx'
$apiProject = Join-Path $projectRoot 'SDD.API\SDD.API\SDD.API.csproj'
$apiTestProject = Join-Path $projectRoot 'SDD.API\SDD.API.Tests\SDD.API.Tests.csproj'
$apiTestOutput = 'obj\FeatureApiTests\'
$apiTestAssembly = Join-Path $projectRoot 'SDD.API\SDD.API\obj\FeatureApiTests\SDD.API.dll'
$uiFolder = Join-Path $projectRoot 'sdd-ui'
$apiPort = 7246

if ([string]::IsNullOrWhiteSpace($env:SDD_TEST_ORACLE_CONNECTION)) {
    throw 'Set SDD_TEST_ORACLE_CONNECTION to the connection string of the approved Oracle TEST schema, then run this again.'
}

# PowerShell does not stop on a failing program by itself, so every step checks the exit code.
function Invoke-Step {
    param([string]$Name, [scriptblock]$Command)

    Write-Host ""
    Write-Host "=== $Name ===" -ForegroundColor Cyan
    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Step failed: $Name (exit code $LASTEXITCODE)."
    }
}

function Wait-ForPort {
    param([int]$Port, [int]$TimeoutSeconds = 90)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        $client = New-Object System.Net.Sockets.TcpClient
        try {
            $client.Connect('localhost', $Port)
            return
        }
        catch {
            Start-Sleep -Seconds 1
        }
        finally {
            $client.Dispose()
        }
    }
    throw "The API did not start listening on port $Port within $TimeoutSeconds seconds."
}

Invoke-Step 'C# formatting' { dotnet format whitespace $apiSolution --verify-no-changes }
Invoke-Step 'C# analyzers' { dotnet format analyzers $apiSolution --verify-no-changes }
Invoke-Step 'API tests' { dotnet test --project $apiTestProject --property:OutputPath=$apiTestOutput }

Push-Location $uiFolder
try {
    Invoke-Step 'Angular lint' { npm run lint }
    Invoke-Step 'Angular formatting' { npm run format:check }
    Invoke-Step 'Angular tests' { npm test -- --watch=false }
    Invoke-Step 'Production build' { npm run build }

    $env:ConnectionStrings__SddOracle = $env:SDD_TEST_ORACLE_CONNECTION
    $env:ASPNETCORE_ENVIRONMENT = 'Development'
    $api = Start-Process -FilePath 'dotnet' `
        -ArgumentList @($apiTestAssembly, '--urls', "https://localhost:$apiPort") `
        -PassThru -WindowStyle Hidden -WorkingDirectory (Split-Path $apiProject)
    try {
        Wait-ForPort -Port $apiPort
        Invoke-Step 'Browser tests (Playwright)' { npx playwright test }
    }
    finally {
        if (-not $api.HasExited) {
            Stop-Process -Id $api.Id -Force
        }
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host 'All checks passed.' -ForegroundColor Green
