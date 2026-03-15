/**
 * メディアアダプター（初期はlocal）
 * 将来的に外部ストレージへの切り替えを想定
 */
export function getMediaPath(filename: string): string {
  return `/media/${filename}`;
}
