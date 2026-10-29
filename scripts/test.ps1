$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$solution = Join-Path $repositoryRoot 'Spec-Driven-Development\SDD.API\SDD.API.slnx'
$frontend = Join-Path $repositoryRoot 'Spec-Driven-Development\sdd-ui'
$playwrightScript = Join-Path $repositoryRoot 'Spec-Driven-Development\SDD.API\SDD.API.E2E.Tests\bin\Release\net10.0\playwright.ps1'

Push-Location $repositoryRoot
try {
    dotnet build $solution --configuration Release
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    if (-not (Test-Path $playwrightScript)) {
        Write-Error "Playwright install script was not generated at '$playwrightScript'. Check the end-to-end test project build."
    }

    & $playwrightScript install chromium
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    dotnet test $solution --configuration Release --no-build
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    npm --prefix $frontend test -- --watch=false
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}
