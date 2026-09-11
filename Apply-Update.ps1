param(
    [Parameter(Mandatory = $true)]
    [string]$Target
)

$ErrorActionPreference = 'Stop'
$packageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$payloadRoot = Join-Path $packageRoot 'payload'
$targetRoot = [System.IO.Path]::GetFullPath($Target)
$packageJson = Join-Path $targetRoot 'package.json'

if (-not (Test-Path -LiteralPath $packageJson -PathType Leaf)) {
    throw "目标目录不是 Cavno 源码根目录：找不到 package.json。"
}

$package = Get-Content -LiteralPath $packageJson -Raw -Encoding UTF8 | ConvertFrom-Json
if ($package.name -ne 'cavno-site') {
    throw "目标 package.json 的 name 不是 cavno-site，已停止更新。"
}

$files = @(
    'src/components/ArticleDownloads.astro',
    'src/layouts/Base.astro',
    'scripts/export-article-documents.mjs',
    'scripts/audit-article-documents.mjs',
    'docs/ARTICLE-DOWNLOADS.md',
    'package.json',
    'package-lock.json'
)

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $targetRoot "_increment-backups/article-downloads-$timestamp"

foreach ($relativePath in $files) {
    $source = Join-Path $payloadRoot $relativePath
    $destination = Join-Path $targetRoot $relativePath

    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
        throw "增量包缺少文件：$relativePath"
    }

    if (Test-Path -LiteralPath $destination -PathType Leaf) {
        $backup = Join-Path $backupRoot $relativePath
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
        Copy-Item -LiteralPath $destination -Destination $backup -Force
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item -LiteralPath $source -Destination $destination -Force
}

Write-Host "增量文件已应用到：$targetRoot"
Write-Host "旧文件备份位置：$backupRoot"
Write-Host "请依次运行：npm install、npm run build、npm run documents:generate、npm run documents:audit、npm run build"

