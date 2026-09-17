[CmdletBinding()]
param(
    [string]$Target,
    [ValidateSet('check', 'sample', 'all', 'preview')]
    [string]$Mode,
    [string]$BrowserPath
)
$ErrorActionPreference = 'Stop'
try {
    $candidates = @()
    $detected = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($detected) { $candidates += $detected.Source }
    $candidates += (Join-Path $env:ProgramFiles 'nodejs\node.exe')
    if ($env:LOCALAPPDATA) { $candidates += (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\node.exe') }
    $candidates += (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe')
    $nodePath = $null
    foreach ($candidate in ($candidates | Select-Object -Unique)) {
        if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) { continue }
        $versionText = & $candidate --version 2>$null
        if ($LASTEXITCODE -ne 0 -or $versionText -notmatch '^v(\d+)\.(\d+)\.(\d+)') { continue }
        $major = [int]$Matches[1]
        $minor = [int]$Matches[2]
        if (($major -eq 20 -and $minor -ge 19) -or ($major -eq 22 -and $minor -ge 12) -or $major -ge 24) {
            $nodePath = $candidate
            break
        }
    }
    if (-not $nodePath) {
        throw 'A supported Node.js was not found. Install Node.js 22.12+ or 24 LTS from https://nodejs.org/en/download, then close and reopen this window.'
    }
    $env:PATH = (Split-Path -Parent $nodePath) + ';' + $env:PATH
    $runFile = Join-Path $PSScriptRoot 'run.mjs'
    if (-not (Test-Path -LiteralPath $runFile -PathType Leaf)) { throw 'run.mjs is missing. Extract the entire ZIP first.' }
    $runnerArguments = @($runFile)
    if ($Target) { $runnerArguments += @('--target', $Target) }
    if ($Mode) { $runnerArguments += @('--mode', $Mode) }
    if ($BrowserPath) { $runnerArguments += @('--browser-path', $BrowserPath) }
    & $nodePath @runnerArguments
    exit $LASTEXITCODE
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
