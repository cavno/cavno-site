param(
  [Parameter(Mandatory = $true)]
  [string]$SiteRoot,
  [Parameter(Mandatory = $true)]
  [string]$BackupRoot
)

$ErrorActionPreference = 'Stop'
$siteRootFull = [IO.Path]::GetFullPath($SiteRoot)
$backupRootFull = [IO.Path]::GetFullPath($BackupRoot)
$sitePrefix = $siteRootFull.TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$allowedBackupPrefix = [IO.Path]::GetFullPath((Join-Path $siteRootFull '.cavno-update-backups')).TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar

if (-not $backupRootFull.StartsWith($allowedBackupPrefix, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'BackupRoot must be the recovery-record folder created under SiteRoot\.cavno-update-backups.'
}
$receiptPath = Join-Path $backupRootFull 'install-receipt.json'
if (-not (Test-Path -LiteralPath $receiptPath -PathType Leaf)) {
  throw 'install-receipt.json was not found in BackupRoot.'
}
$receipt = Get-Content -LiteralPath $receiptPath -Raw -Encoding UTF8 | ConvertFrom-Json

foreach ($entry in $receipt.files) {
  $relative = [string]$entry.path
  if ([IO.Path]::IsPathRooted($relative) -or $relative -match '(^|[\/])\.\.([\/]|$)') {
    throw "Unsafe path in recovery record: $relative"
  }
  $target = [IO.Path]::GetFullPath((Join-Path $siteRootFull ($relative -replace '/', '\')))
  if (-not $target.StartsWith($sitePrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Target escaped SiteRoot: $relative"
  }
  if (Test-Path -LiteralPath $target -PathType Leaf) {
    $currentHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($currentHash -ne [string]$entry.sha256) {
      throw "The installed file was changed after installation; recovery stopped: $relative"
    }
  }
}

foreach ($entry in $receipt.files) {
  $relative = [string]$entry.path
  $target = [IO.Path]::GetFullPath((Join-Path $siteRootFull ($relative -replace '/', '\')))
  $backup = Join-Path $backupRootFull ($relative -replace '/', '\')
  if ([bool]$entry.preExisting) {
    if (-not (Test-Path -LiteralPath $backup -PathType Leaf)) {
      throw "A required backup is missing: $relative"
    }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
    Copy-Item -LiteralPath $backup -Destination $target -Force
  } elseif (Test-Path -LiteralPath $target -PathType Leaf) {
    Remove-Item -LiteralPath $target -Force
  }
}

Write-Host 'Recovery completed. Only the four files recorded by this package were restored or removed.'
