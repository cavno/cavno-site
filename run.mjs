import { appendFileSync } from 'node:fs';
import { access, copyFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { createServer } from 'node:net';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const payloadRoot = path.join(packageRoot, 'payload');
const files = [
  'src/components/ArticleDownloads.astro', 'src/layouts/Base.astro',
  'scripts/export-article-documents.mjs', 'scripts/audit-article-documents.mjs',
  'docs/ARTICLE-DOWNLOADS.md', 'package.json', 'package-lock.json',
];
// Only this reviewed Base version, or the exact payload version, may be replaced.
const compatibleBaseHashes = new Set(['6fc14c3279c3834cb67031f6fd7b74b2a069dd959dcb8a0bbf84f4513f7b5e2a']);
const sampleRoute = '/reading/thinking/elementsofgeometry/';
const node = process.execPath;
process.env.PATH = `${path.dirname(node)}${path.delimiter}${process.env.PATH || ''}`;
let target = '';
let mode = '';
let logPath = '';
let phase = '准备';
let childProcess;
let interrupted = false;
const hash = value => createHash('sha256').update(value).digest('hex');
const exists = async file => { try { await access(file); return true; } catch { return false; } };
const json = async file => JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, ''));
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');
function log(message = '') {
  const line = String(message);
  console.log(line);
  if (logPath) appendFileSync(logPath, line + '\n', 'utf8');
}
function step(message) {
  if (interrupted) throw new Error('操作已被中断，后续步骤没有继续执行。');
  phase = message;
  log(`\n【${message}】`);
}
function command(executable, args, { cwd = target || packageRoot, quiet = false, env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    if (interrupted) { reject(new Error('操作已被中断，后续命令没有继续执行。')); return; }
    const child = spawn(executable, args, { cwd, env, windowsHide: true, stdio: ['inherit', 'pipe', 'pipe'] });
    childProcess = child;
    let output = '';
    for (const stream of [child.stdout, child.stderr]) stream.setEncoding('utf8').on('data', text => {
      output += text;
      if (!quiet) process.stdout.write(text);
      if (logPath) appendFileSync(logPath, text, 'utf8');
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      childProcess = undefined;
      if (interrupted) reject(new Error('操作已被中断，后续步骤没有继续执行。'));
      else if (code === 0) resolve(output.trim());
      else reject(new Error(`${phase}失败：退出码 ${code ?? signal}。${quiet ? '\n' + output.slice(-3000) : ''}`));
    });
  });
}
process.on('SIGINT', () => { interrupted = true; childProcess?.kill('SIGINT'); });

function argumentsFromCLI() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') { result.help = true; continue; }
    if (!['--target', '--mode', '--browser-path'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) {
      throw new Error(`无法识别参数：${args[i]}。支持 --target "源码路径" --mode check|sample|all|preview。`);
    }
    result[args[i].slice(2)] = args[++i];
  }
  return result;
}
async function getInputs(options) {
  const reader = createInterface({ input: process.stdin, output: process.stdout });
  try {
    let directory = options.target;
    if (!directory) directory = await reader.question('请粘贴网站源码根目录（这一层直接包含 package.json、src、public），然后按回车：\n');
    directory = directory.trim().replace(/^"|"$/g, '');
    if (!directory) throw new Error('没有输入源码路径。');
    target = path.resolve(directory);
    mode = options.mode;
    if (!mode) {
      log('\n请选择：1 检查环境，2 单篇测试（首次建议），3 生成全站，4 打开本地预览。');
      const answer = (await reader.question('输入数字后按回车 [默认 2]：')).trim() || '2';
      mode = ({ 1: 'check', 2: 'sample', 3: 'all', 4: 'preview' })[answer];
    }
    if (!['check', 'sample', 'all', 'preview'].includes(mode)) throw new Error('模式应为 check、sample、all 或 preview。');
  } finally { reader.close(); }
}
async function preflight() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (!((major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major >= 24)) {
    throw new Error(`当前 Node.js ${process.version} 不符合要求。请使用 Node.js 22.12+ 或 24 LTS。`);
  }
  const pkg = await json(path.join(target, 'package.json')).catch(() => { throw new Error('源码路径不正确：找不到或无法读取 package.json。请选直接包含 package.json、src、public 的内层文件夹。'); });
  if (pkg.name !== 'cavno-site') throw new Error(`目标包名称为 ${pkg.name}，不是 cavno-site，已停止。`);
  for (const item of ['src', 'public']) if (!(await stat(path.join(target, item))).isDirectory()) throw new Error(`源码目录缺少 ${item} 文件夹。`);
  if (!await exists(path.join(target, 'scripts/gen-shell.mjs'))) throw new Error('源码目录缺少 scripts/gen-shell.mjs，尚未形成可构建的完整网站源码。');
  if (target === packageRoot || target === payloadRoot) throw new Error('不能把增量工具或 payload 目录作为网站源码。');
  for (const file of files) if (!(await stat(path.join(payloadRoot, file)).catch(() => null))?.isFile()) throw new Error(`增量包不完整，缺少 payload/${file}。请重新完整解压。`);
  const incoming = await json(path.join(payloadRoot, 'package.json'));
  const lock = await json(path.join(payloadRoot, 'package-lock.json'));
  if (incoming.name !== 'cavno-site' || lock.name !== 'cavno-site' || !lock.packages?.['node_modules/astro']) throw new Error('增量包中的依赖清单或锁文件不正确。');
  const baseFile = path.join(target, 'src/layouts/Base.astro');
  const currentHash = hash(await readFile(baseFile));
  const incomingHash = hash(await readFile(path.join(payloadRoot, 'src/layouts/Base.astro')));
  if (currentHash !== incomingHash && !compatibleBaseHashes.has(currentHash)) {
    throw new Error('你的 Base.astro 与本增量包适用版本不同，可能包含更新后的导航或布局。为避免覆盖较新的改动，已停止应用。请提供当前 src/layouts/Base.astro 与 package.json 以便合并；不要删除此检查或强行覆盖。');
  }
  // Preserve user-added dependencies/scripts instead of silently replacing them.
  for (const group of ['dependencies', 'devDependencies', 'scripts']) {
    for (const [key, value] of Object.entries(pkg[group] || {})) {
      if (!(key in (incoming[group] || {})) || incoming[group][key] !== value) {
        throw new Error(`当前 package.json 的 ${group}.${key} 与增量版本不匹配。已停止，需先合并此字段，防止覆盖现有设置。`);
      }
    }
  }
  const logs = path.join(target, '.cavno-tools/logs');
  await mkdir(logs, { recursive: true });
  logPath = path.join(logs, `${stamp()}-${mode}.log`);
  log(`Cavno 下载工具 v3\n模式：${mode}\n源码：${target}\nNode.js：${process.version}\nNode 路径：${node}\n日志：${logPath}`);
  return lock;
}
async function browserPath(preferred) {
  const candidates = preferred ? [path.resolve(preferred.replace(/^"|"$/g, ''))] : [
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft/Edge/Application/msedge.exe'),
  ];
  for (const file of candidates) if (await exists(file)) return file;
  throw new Error('没有找到 Edge 或 Chrome。请安装其中一个，或用 --browser-path "浏览器 exe 完整路径" 指定。');
}
async function npmCLI(download = true) {
  const nodeDir = path.dirname(node);
  const local = path.join(target, '.cavno-tools/npm/package/bin/npm-cli.js');
  const candidates = [
    path.join(nodeDir, 'node_modules/npm/bin/npm-cli.js'),
    path.join(nodeDir, '../node_modules/npm/bin/npm-cli.js'),
    path.join(process.env.APPDATA || '', 'npm/node_modules/npm/bin/npm-cli.js'), local,
  ];
  for (const file of candidates) {
    if (!await exists(file)) continue;
    try {
      const pkg = await json(path.resolve(file, '../../package.json'));
      const [major, minor, patch] = String(pkg.version || '').split('.').map(Number);
      if (major > 9 || (major === 9 && (minor > 6 || (minor === 6 && patch >= 5)))) return file;
    } catch { /* Try the next installation. */ }
  }
  if (!download) return null;
  step('准备项目专用 npm（首次缺少 npm 时联网下载）');
  const metadataResponse = await fetch('https://registry.npmjs.org/npm/11.6.0', { signal: AbortSignal.timeout(60000) });
  if (!metadataResponse.ok) throw new Error(`无法读取官方 npm 信息：HTTP ${metadataResponse.status}。检查网络后重试。`);
  const metadata = await metadataResponse.json();
  if (metadata.name !== 'npm' || metadata.version !== '11.6.0') throw new Error('官方 npm 版本信息校验失败。');
  const url = new URL(metadata.dist?.tarball);
  if (url.protocol !== 'https:' || url.hostname !== 'registry.npmjs.org') throw new Error('npm 下载地址不是官方 registry.npmjs.org。');
  const expected = String(metadata.dist.integrity || '').split(/\s+/).find(value => value.startsWith('sha512-'));
  if (!expected) throw new Error('官方 npm 包没有 SHA-512 完整性信息。');
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`npm 下载失败：HTTP ${response.status}。`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const actual = createHash('sha512').update(bytes).digest();
  const expectedBytes = Buffer.from(expected.slice(7), 'base64');
  if (actual.length !== expectedBytes.length || !timingSafeEqual(actual, expectedBytes)) throw new Error('npm 下载包 SHA-512 校验失败，未安装。请检查网络后重试。');
  const toolsRoot = path.join(target, '.cavno-tools');
  await mkdir(toolsRoot, { recursive: true });
  const archive = path.join(toolsRoot, 'npm-11.6.0.tgz');
  await writeFile(archive, bytes);
  const tar = path.join(process.env.SystemRoot || 'C:/Windows', 'System32/tar.exe');
  if (!await exists(tar)) throw new Error('找不到 Windows 自带 tar.exe。请安装完整 Node.js 22/24（包含 npm），再重试。');
  const listing = await command(tar, ['-tzf', archive], { quiet: true });
  if (listing.split(/\r?\n/).some(entry => entry && (!entry.startsWith('package/') || entry.split('/').includes('..')))) throw new Error('npm 归档内出现异常路径，已停止。');
  const temporary = path.join(toolsRoot, `npm-unpack-${randomUUID()}`);
  await mkdir(temporary);
  await command(tar, ['-xzf', archive, '-C', temporary], { quiet: true });
  const downloadedPackage = await json(path.join(temporary, 'package/package.json'));
  if (downloadedPackage.name !== 'npm' || downloadedPackage.version !== '11.6.0') throw new Error('npm 解压结果校验失败。');
  const destination = path.join(toolsRoot, 'npm');
  if (await exists(destination)) await rename(destination, path.join(toolsRoot, `npm-previous-${randomUUID()}`));
  await rename(temporary, destination);
  log('官方 npm 11.6.0 已校验并放入此网站的 .cavno-tools/npm，不修改全局 npm。');
  return local;
}
async function applyFiles() {
  step('备份并应用 7 个增量文件');
  const backup = path.join(target, `_increment-backups/article-downloads-v3-${stamp()}`);
  const records = [];
  // Back up every existing file before making the first source change.
  for (const relative of files) {
    const destination = path.join(target, relative);
    const existed = await exists(destination);
    records.push({ path: relative, existed });
    if (existed) {
      const saved = path.join(backup, relative);
      await mkdir(path.dirname(saved), { recursive: true });
      await copyFile(destination, saved);
    }
  }
  await mkdir(backup, { recursive: true });
  await writeFile(path.join(backup, 'backup-manifest.json'), JSON.stringify({ createdAt: new Date().toISOString(), target, files: records }, null, 2));
  for (const relative of files) {
    const destination = path.join(target, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(payloadRoot, relative), destination);
  }
  log(`旧文件备份：${backup}`);
}
async function dependenciesValid(lock) {
  for (const name of ['astro', 'docx', 'jszip', 'playwright-core']) {
    const installed = await json(path.join(target, 'node_modules', name, 'package.json')).catch(() => null);
    if (!installed || installed.version !== lock.packages[`node_modules/${name}`]?.version) return false;
  }
  try {
    await command(node, ['--input-type=module', '-e', 'await Promise.all(["astro","docx","jszip","playwright-core"].map(name=>import(name))); console.log("依赖导入检查通过");'], { quiet: true });
    await command(node, [path.join(target, 'node_modules/astro/astro.js'), '--version'], { quiet: true });
    return true;
  } catch { return false; }
}
async function prepareDependencies(lock) {
  step('检查所需依赖');
  const fingerprintFile = path.join(target, '.cavno-tools/install-fingerprint.json');
  const fingerprint = hash(Buffer.concat([await readFile(path.join(target, 'package-lock.json')), Buffer.from(`${process.version}/${process.platform}/${process.arch}`)]));
  const previous = await json(fingerprintFile).catch(() => null);
  const valid = await dependenciesValid(lock);
  if (valid && (!previous || previous.fingerprint === fingerprint)) {
    log('现有依赖版本、模块导入和 Astro 均通过检查，跳过重复安装。');
  } else {
    const npm = await npmCLI();
    step('安装锁定依赖（可能需要几分钟）');
    const npmEnvironment = { ...process.env, NODE_ENV: 'development' };
    await command(node, [npm, 'ci', '--include=dev', '--include=optional', '--no-audit', '--no-fund', '--cache', path.join(target, '.cavno-tools/npm-cache')], { env: npmEnvironment });
    if (!await dependenciesValid(lock)) throw new Error('安装命令结束，但依赖版本或模块导入仍未通过检查。请查看日志。');
  }
  await writeFile(fingerprintFile, JSON.stringify({ fingerprint, node: process.version, verifiedAt: new Date().toISOString() }, null, 2));
}
async function build(label) {
  step(label);
  await command(node, [path.join(target, 'scripts/gen-shell.mjs')]);
  await command(node, [path.join(target, 'node_modules/astro/astro.js'), 'build']);
}
async function audit(root) {
  const args = [path.join(target, 'scripts/audit-article-documents.mjs'), '--root', root];
  if (mode === 'sample') args.push('--route', sampleRoute);
  await command(node, args);
}
async function main() {
  const options = argumentsFromCLI();
  if (options.help) { log('用法：node run.mjs --target "网站源码目录" --mode check|sample|all|preview [--browser-path "浏览器.exe"]'); return; }
  await getInputs(options);
  const lock = await preflight();
  if (mode === 'preview') {
    if (!await exists(path.join(target, 'dist/index.html'))) throw new Error('还没有 dist/index.html。请先运行单篇测试或全站生成。');
    if (!await dependenciesValid(lock)) throw new Error('本地预览依赖尚未就绪，请先运行单篇测试。');
    await new Promise((resolve, reject) => {
      const probe = createServer();
      probe.once('error', () => reject(new Error('本机 4350 端口正在使用。请关闭之前的 Cavno 预览窗口（Ctrl+C），再重新打开预览。')));
      probe.listen(4350, '127.0.0.1', () => probe.close(resolve));
    });
    step('本地预览正在运行，关闭请按 Ctrl+C');
    log(`浏览器打开：http://127.0.0.1:4350${sampleRoute}\n这是本机预览地址。请保持这个窗口打开。`);
    await command(node, [path.join(target, 'node_modules/astro/astro.js'), 'preview', '--host', '127.0.0.1', '--port', '4350']);
    return;
  }
  const browser = await browserPath(options['browser-path']);
  log(`浏览器：${browser}`);
  if (mode === 'check') {
    step('检查环境');
    const npm = await npmCLI(false);
    log(npm ? `npm：${npm}` : '当前没有 npm；正式运行需要安装依赖时，工具将下载并校验官方 npm 到项目内。');
    log(await dependenciesValid(lock) ? '依赖检查通过。' : '依赖尚未就绪，单篇测试或全站模式将自动安装。');
    log('【环境检查完成】源码未覆盖，未安装依赖，未生成文档。下一步选择 2：单篇测试。');
    return;
  }
  await applyFiles();
  await prepareDependencies(lock);
  await build('第一次构建网站');
  step(mode === 'sample' ? '生成单篇测试文档' : '生成全站文档（可中断后重跑，已完成文件会复用）');
  const generator = [path.join(target, 'scripts/export-article-documents.mjs'), '--browser-path', browser, '--resume'];
  if (mode === 'sample') generator.push('--route', sampleRoute);
  await command(node, generator);
  step('检查 public 中的下载文件');
  await audit('public');
  await build('第二次构建，装入下载文件');
  step('检查最终 dist 中的下载文件');
  await audit('dist');
  if (mode === 'sample') {
    log('【单篇测试完成】几何原本文档生成及最终目录检查通过。全站文档尚未生成。');
    log('下一步：重新双击 Start.cmd，选择 4 打开本地预览；确认三种文档可打开后，选择 3 生成全站。');
  } else {
    log('【全站生成完成】全站三种下载文件均已生成，并通过最终 dist 检查。');
    log(`最终静态目录：${path.join(target, 'dist')}\n如使用 Git 构建上线，还需要提交 public 下生成的 downloads 目录。`);
  }
  log(`日志：${logPath}`);
}
try { await main(); }
catch (error) {
  if (interrupted && mode === 'preview') { log('\n本地预览已停止。'); process.exitCode = 0; }
  else {
    log(`\n【未完成】停在“${phase}”。\n${error.message}`);
    if (logPath) log(`完整日志：${logPath}`);
    log('请保留上述报错文字。当前结果尚未完成验证；排除错误后可使用同一模式重新运行。');
    process.exitCode = 1;
  }
}
