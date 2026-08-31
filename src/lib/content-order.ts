import type { CollectionEntry } from 'astro:content';

export type ItemEntry = CollectionEntry<'items'>;

/**
 * 上传时间优先；旧条目没有 uploadedAt 时，继续使用原发布日期。
 * 不读取文件修改时间，因为 Git/Cloudflare 构建会重写文件时间，无法代表真实上传顺序。
 */
export function itemUpdatedAt(item: ItemEntry): Date {
  return item.data.uploadedAt ?? item.data.date;
}

export function itemUpdateTimestamp(item: ItemEntry): number {
  return itemUpdatedAt(item).getTime();
}

/** 最新在前；时间完全相同时按英文网址固定排序，避免文件扫描顺序造成随机变化。 */
export function compareItemsNewestFirst(a: ItemEntry, b: ItemEntry): number {
  return itemUpdateTimestamp(b) - itemUpdateTimestamp(a)
    || b.data.date.getTime() - a.data.date.getTime()
    || a.data.href.localeCompare(b.data.href, 'en');
}

const shanghaiDateTime = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** 生成不受部署服务器时区影响的北京时间标签，例如 2026-08-31 05:23。 */
export function formatUpdateTime(date: Date): string {
  return shanghaiDateTime.format(date).replace(',', '');
}
