param([Parameter(Mandatory=$true)][string]$SiteRoot)
$ErrorActionPreference = 'Stop'
$sitePath = (Resolve-Path -LiteralPath $SiteRoot).Path
$packagePath = $PSScriptRoot

if (!(Test-Path -LiteralPath (Join-Path $sitePath 'package.json')) -or !(Test-Path -LiteralPath (Join-Path $sitePath 'src/content/nav.json'))) {
    throw 'SiteRoot must be the Cavno source folder containing package.json and src/content/nav.json.'
}

$manifest = Get-Content -LiteralPath (Join-Path $packagePath 'files.json') -Raw | ConvertFrom-Json

function Resolve-ContainedPath([string]$Base, [string]$Relative) {
    $baseFull = [IO.Path]::GetFullPath($Base).TrimEnd([IO.Path]::DirectorySeparatorChar)
    $resolved = [IO.Path]::GetFullPath((Join-Path $baseFull $Relative))
    $prefix = $baseFull + [IO.Path]::DirectorySeparatorChar
    if (!$resolved.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { throw "Unsafe path: $Relative" }
    return $resolved
}

foreach ($entry in $manifest.files) {
    $source = Resolve-ContainedPath $packagePath $entry.path
    if (!(Test-Path -LiteralPath $source -PathType Leaf)) { throw "Package file missing: $($entry.path)" }
    if ((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower() -ne $entry.sha256) {
        throw "Package checksum mismatch: $($entry.path)"
    }
    $target = Resolve-ContainedPath $sitePath $entry.path
    if (Test-Path -LiteralPath $target -PathType Leaf) {
        $targetHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()
        if ($targetHash -ne $entry.sha256) {
            throw "Target already contains a different file: $($entry.path). Stop and merge it manually."
        }
    }
}

$backupRelative = '.cavno-update-backups/three-systems-essays-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0,8)
$backupPath = Resolve-ContainedPath $sitePath $backupRelative
$null = New-Item -ItemType Directory -Path $backupPath

foreach ($entry in $manifest.files) {
    $target = Resolve-ContainedPath $sitePath $entry.path
    if (Test-Path -LiteralPath $target -PathType Leaf) {
        $saved = Resolve-ContainedPath $backupPath $entry.path
        $null = New-Item -ItemType Directory -Path (Split-Path -Parent $saved) -Force
        Copy-Item -LiteralPath $target -Destination $saved
    }
}

foreach ($entry in $manifest.files) {
    $source = Resolve-ContainedPath $packagePath $entry.path
    $target = Resolve-ContainedPath $sitePath $entry.path
    $null = New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force
    Copy-Item -LiteralPath $source -Destination $target -Force
}

Copy-Item -LiteralPath (Join-Path $packagePath 'files.json') -Destination (Join-Path $backupPath 'applied-files.json')
Write-Host "Update applied. Backup: $backupPath"
Write-Host 'Next: run npm run build in the Cavno source folder.'
