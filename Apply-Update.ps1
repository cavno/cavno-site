param(
  [Parameter(Mandatory = $true)]
  [string]$SiteRoot
)

$ErrorActionPreference = 'Stop'
$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$siteRootFull = [IO.Path]::GetFullPath($SiteRoot)
$rootPrefix = $siteRootFull.TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar

if (-not (Test-Path -LiteralPath (Join-Path $siteRootFull 'package.json') -PathType Leaf)) {
  throw 'SiteRoot is not a Cavno source root: package.json was not found.'
}
$navPath = Join-Path $siteRootFull 'src\content\nav.json'
if (-not (Test-Path -LiteralPath $navPath -PathType Leaf)) {
  throw 'SiteRoot is not a Cavno source root: src\content\nav.json was not found.'
}

$manifest = Get-Content -LiteralPath (Join-Path $packageRoot 'files.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$plan = @()
foreach ($entry in $manifest.files) {
  $relative = [string]$entry.path
  if ([IO.Path]::IsPathRooted($relative) -or $relative -match '(^|[\\/])\.\.([\\/]|$)') {
    throw "Unsafe path in files.json: $relative"
  }
  $source = [IO.Path]::GetFullPath((Join-Path $packageRoot ($relative -replace '/', '\')))
  $target = [IO.Path]::GetFullPath((Join-Path $siteRootFull ($relative -replace '/', '\')))
  if (-not $target.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Target escaped SiteRoot: $relative"
  }
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Package file is missing: $relative"
  }
  $hash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
  $bytes = (Get-Item -LiteralPath $source).Length
  if ($hash -ne [string]$entry.sha256 -or $bytes -ne [long]$entry.bytes) {
    throw "Package verification failed: $relative"
  }
  if (Test-Path -LiteralPath $target -PathType Leaf) {
    $targetHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($targetHash -ne $hash) {
      throw "A different file already exists; nothing was changed: $relative"
    }
  }
  $plan += [pscustomobject]@{ Relative = $relative; Source = $source; Target = $target }
}

$oldDescription = '"desc": "科目三 / 科目四备考实验台"'
$newDescription = '"desc": "新手上路、驾驶实务、驾考训练与智能驾驶系统"'
$navText = [IO.File]::ReadAllText($navPath)
$patchNav = $false
if ($navText.Contains($newDescription)) {
  $patchNav = $false
} elseif ($navText.Contains($oldDescription)) {
  $patchNav = $true
} else {
  throw 'Driving description in nav.json differs from both the expected old and new value; nothing was changed.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$suffix = [Guid]::NewGuid().ToString('N').Substring(0, 8)
$backupRoot = Join-Path $siteRootFull ".cavno-update-backups\beginner-driving-practical-manual-$stamp-$suffix"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

foreach ($item in $plan) {
  if (Test-Path -LiteralPath $item.Target -PathType Leaf) {
    $backup = Join-Path $backupRoot ($item.Relative -replace '/', '\')
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
    Copy-Item -LiteralPath $item.Target -Destination $backup -Force
  }
}
if ($patchNav) {
  $navBackup = Join-Path $backupRoot 'src\content\nav.json'
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $navBackup) | Out-Null
  Copy-Item -LiteralPath $navPath -Destination $navBackup -Force
}

foreach ($item in $plan) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $item.Target) | Out-Null
  Copy-Item -LiteralPath $item.Source -Destination $item.Target -Force
}
if ($patchNav) {
  $updatedNav = $navText.Replace($oldDescription, $newDescription)
  [IO.File]::WriteAllText($navPath, $updatedNav, [Text.UTF8Encoding]::new($false))
}

Write-Host "Update applied. Backup: $backupRoot"
Write-Host 'Next: run npm run build in the Cavno source folder.'
