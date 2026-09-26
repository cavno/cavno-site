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
if (-not (Test-Path -LiteralPath (Join-Path $siteRootFull 'src\content\nav.json') -PathType Leaf)) {
  throw 'SiteRoot is not a Cavno source root: src\content\nav.json was not found.'
}

$manifest = Get-Content -LiteralPath (Join-Path $packageRoot 'files.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$plan = @()
foreach ($entry in $manifest.files) {
  $relative = [string]$entry.path
  if ([IO.Path]::IsPathRooted($relative) -or $relative -match '(^|[\/])\.\.([\/]|$)') {
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
  $preExisting = Test-Path -LiteralPath $target -PathType Leaf
  if ($preExisting) {
    $targetHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($targetHash -ne $hash) {
      throw "A different file already exists; nothing was changed: $relative"
    }
  }
  $plan += [pscustomobject]@{
    Relative = $relative
    Source = $source
    Target = $target
    Sha256 = $hash
    PreExisting = $preExisting
  }
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$suffix = [Guid]::NewGuid().ToString('N').Substring(0, 8)
$backupRoot = Join-Path $siteRootFull ".cavno-update-backups\adspower-ssh-ipv4-ipv6-guide-$stamp-$suffix"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

foreach ($item in $plan) {
  if ($item.PreExisting) {
    $backup = Join-Path $backupRoot ($item.Relative -replace '/', '\')
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
    Copy-Item -LiteralPath $item.Target -Destination $backup -Force
  }
}
foreach ($item in $plan) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $item.Target) | Out-Null
  Copy-Item -LiteralPath $item.Source -Destination $item.Target -Force
}

$receipt = [ordered]@{
  packageId = [string]$manifest.packageId
  appliedAt = (Get-Date).ToString('o')
  siteRoot = $siteRootFull
  files = @($plan | ForEach-Object {
    [ordered]@{ path = $_.Relative; sha256 = $_.Sha256; preExisting = $_.PreExisting }
  })
}
$receipt | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $backupRoot 'install-receipt.json') -Encoding UTF8

Write-Host "Update applied. Route: $($manifest.route)"
Write-Host "Recovery record: $backupRoot"
Write-Host 'Next: run npm run build in the Cavno source folder.'
