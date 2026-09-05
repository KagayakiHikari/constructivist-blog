export function safeMarkdownUrl(url: string | undefined) {
  if (!url) return "";

  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^mailto:/i.test(url)) return url;

  return "";
}
