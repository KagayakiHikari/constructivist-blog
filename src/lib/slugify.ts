export function slugifyText(input: string) {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{Script=Han}a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || `post-${Date.now().toString(36)}`;
}
