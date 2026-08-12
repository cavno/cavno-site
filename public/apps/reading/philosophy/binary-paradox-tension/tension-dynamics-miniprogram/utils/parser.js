// 将 markdown 风格文本解析为结构化区块，交给 WXML 原生组件渲染
// 支持： # / ## / ### 标题，**加粗** 行内，--- 分隔线，- 列表项，普通段落

function parseInline(text) {
  const segs = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      segs.push({ t: text.slice(last, m.index), b: false });
    }
    segs.push({ t: m[1], b: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    segs.push({ t: text.slice(last), b: false });
  }
  if (segs.length === 0) {
    segs.push({ t: text, b: false });
  }
  return segs;
}

// 识别二级标题的语义类别，用于差异化样式
function h2Kind(t) {
  if (/^前置/.test(t)) return 'intro';
  if (/^母悖论/.test(t)) return 'core';
  if (/^元结论/.test(t)) return 'meta';
  if (/^第[一二三四五六七八九十百零〇\d]+张力/.test(t)) return 'tension';
  return 'plain';
}

function parse(md) {
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let para = [];
  let secIndex = 0;

  function flushPara() {
    if (!para.length) return;
    const text = para.join('\n');
    // 诗化收束：短行（无标点结尾或极短）单独成行，居中淡处理
    const isVerse = text.length <= 18 && !/[，。：；、""]$/.test(text) || /^未济[，,、]?\s*亨/.test(text);
    blocks.push({
      type: 'p',
      verse: isVerse,
      segs: parseInline(text)
    });
    para = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, '');
    const trimmed = line.trim();

    if (trimmed === '') { flushPara(); continue; }

    if (/^### /.test(line)) {
      flushPara();
      blocks.push({ type: 'h3', segs: parseInline(line.replace(/^### /, '')) });
      continue;
    }
    if (/^## /.test(line)) {
      flushPara();
      const txt = line.replace(/^## /, '');
      blocks.push({ type: 'h2', kind: h2Kind(txt), id: 'sec-' + secIndex, segs: parseInline(txt), raw: txt });
      secIndex++;
      continue;
    }
    if (/^# /.test(line)) {
      flushPara();
      blocks.push({ type: 'h1', segs: parseInline(line.replace(/^# /, '')) });
      continue;
    }
    if (trimmed === '---' || /^[-—]{3,}$/.test(trimmed)) {
      flushPara();
      blocks.push({ type: 'hr' });
      continue;
    }
    if (/^- /.test(line)) {
      flushPara();
      blocks.push({ type: 'li', segs: parseInline(line.replace(/^- /, '')) });
      continue;
    }
    para.push(line);
  }
  flushPara();
  return blocks;
}

// 抽取大纲（二级标题），供目录跳转
function outline(blocks) {
  const items = [];
  blocks.forEach(function (b) {
    if (b.type === 'h2') {
      items.push({ id: b.id, text: b.raw, kind: b.kind });
    }
  });
  return items;
}

module.exports = { parse: parse, outline: outline };
