import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "content", "posts");
const publicDir = path.join(root, "public");
const staticDir = path.join(root, "static");
const outputDir = path.join(root, "dist");

const basePath = (process.env.BASE_PATH || "/").replace(/\/$/, "");
const siteUrl = (process.env.SITE_URL || `https://kagayakihikari.github.io${basePath}`).replace(/\/$/, "");
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "CONSTRUCTIVIST BLOG";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(url = "") {
  const value = String(url).trim();
  if (!value || value.startsWith("#")) return value || "#";
  if (/^(https?:|mailto:)/i.test(value)) return value;
  if (value.startsWith("/")) return `${basePath}${value}`;
  return value;
}

function parseFrontMatter(raw, filename) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) throw new Error(`Missing front matter: ${filename}`);

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim());
    if (item) metadata[item[1].toLowerCase()] = item[2].trim().replace(/^["']|["']$/g, "");
  }

  const slug = metadata.slug || path.basename(filename, ".md");
  const draft = String(metadata.draft || "false").toLowerCase() === "true";
  const tags = (metadata.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: metadata.title || path.basename(filename, ".md"),
    slug,
    date: metadata.date || "1970-01-01",
    tags,
    cover: metadata.cover || "",
    excerpt: metadata.excerpt || "",
    body: raw.slice(match[0].length).trim(),
    draft
  };
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

function renderMarkdown(markdown) {
  const components = {
    a({ href, children }) {
      return React.createElement("a", { href: safeUrl(href) }, children);
    },
    img({ src, alt }) {
      return React.createElement("img", { src: safeUrl(src), alt: alt || "" });
    }
  };

  return renderToStaticMarkup(
    React.createElement(
      Markdown,
      { remarkPlugins: [remarkGfm], components },
      markdown
    )
  );
}

function layout({ title, description, active = "", content }) {
  const links = [
    { href: `${basePath}/`, label: "Home", key: "home" },
    { href: `${basePath}/posts/`, label: "Articles", key: "posts" },
    { href: `${basePath}/about/`, label: "About", key: "about" }
  ];

  const nav = links
    .map((link) => `<a class="nav-link${active === link.key ? " active" : ""}" href="${link.href}">${link.label}</a>`)
    .join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="generator" content="Constructivist Static Blog">
  <link rel="stylesheet" href="${basePath}/styles.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${basePath}/"><span class="brand-square"></span>${escapeHtml(siteName)}</a>
      <nav class="main-nav" aria-label="Main navigation">${nav}</nav>
    </div>
  </header>
  <main>${content}</main>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <div class="footer-brand">${escapeHtml(siteName)}</div>
        <div class="footer-note">Built as a static poster for the web.</div>
      </div>
      <div class="footer-note">Content by Git · Deployed by GitHub Pages</div>
    </div>
    <div class="footer-stripe"></div>
  </footer>
</body>
</html>`;
}

function writePage(relativePath, html) {
  const target = path.join(outputDir, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${html}\n`, "utf8");
}

function postCard(post, index) {
  return `<a class="post-card" href="${basePath}/posts/${escapeHtml(post.slug)}/">
    <div class="post-card-top">
      <span class="post-number">${String(index + 1).padStart(3, "0")}</span>
      <span class="post-date">${escapeHtml(formatDate(post.date))}</span>
    </div>
    <div class="post-card-body">
      <h3>${escapeHtml(post.title)}</h3>
      <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="tag-row">${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
  </a>`;
}

function parseAbout() {
  const file = path.join(root, "content", "about.md");
  if (!existsSync(file)) {
    return {
      title: "About",
      body: "## About\n\nThis static blog has no about page yet."
    };
  }
  const raw = readFileSync(file, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  const body = match ? raw.slice(match[0].length).trim() : raw.trim();
  const title = match ? /^title:\s*(.+)$/m.exec(match[1])?.[1] || "About" : "About";
  return { title, body };
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

if (!existsSync(postsDir)) {
  throw new Error(`Posts directory does not exist: ${postsDir}`);
}

const posts = readdirSync(postsDir)
  .filter((filename) => filename.endsWith(".md"))
  .map((filename) => parseFrontMatter(readFileSync(path.join(postsDir, filename), "utf8"), filename))
  .filter((post) => !post.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

if (posts.some((post) => !/^[a-z0-9-]+$/.test(post.slug))) {
  throw new Error("Static post slugs must contain only lowercase letters, numbers, and dashes.");
}

const about = parseAbout();

const homeContent = `<section class="hero">
  <div class="container hero-grid">
    <div class="hero-content">
      <div class="hero-label"><span class="brand-square"></span>Static Constructivist Blog</div>
      <h1 class="hero-title">BUILD THE<br>PAGE LIKE<br>A POSTER</h1>
      <p class="hero-subtitle">红、黑、黄、蓝构成视觉秩序。这里是一个纯静态 GitHub Pages 博客：无数据库、无后台、无服务端 API，内容由 Markdown 与 Git 管理。</p>
      <div class="hero-actions">
        <a class="button button-primary" href="${basePath}/posts/">Read Articles</a>
        <a class="button button-secondary" href="${basePath}/about/">About This Site</a>
      </div>
    </div>
    <div class="manifesto-card">
      <div class="manifesto-inner">
        <div class="manifesto-label">Visual Manifesto</div>
        <div class="manifesto-title">RED<br>BLACK<br>YELLOW</div>
        <div class="color-row color-red"></div>
        <div class="color-row color-black"></div>
        <div class="color-row color-yellow"></div>
        <div class="color-row color-blue"></div>
      </div>
      <div class="manifesto-square"></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Latest Articles</h2>
      <div class="section-note">${posts.length} Post${posts.length === 1 ? "" : "s"} · Static Build</div>
    </div>
    ${posts.length ? `<div class="posts-grid">${posts.slice(0, 6).map(postCard).join("")}</div>` : `<div class="empty-state">No articles yet</div>`}
  </div>
</section>`;

writePage("index.html", layout({
  title: `${siteName} · Constructivist Static Blog`,
  description: "A constructivist static personal blog deployed on GitHub Pages.",
  active: "home",
  content: homeContent
}));

const postsContent = `<section class="page-hero">
  <div class="container page-hero-inner">
    <h1 class="page-title">Articles</h1>
    <div class="page-meta"><span class="tag">${posts.length} Posts</span><span class="tag">Markdown</span><span class="tag">Git</span></div>
  </div>
</section>
<section class="section">
  <div class="container">
    ${posts.length ? `<div class="posts-grid">${posts.map(postCard).join("")}</div>` : `<div class="empty-state">No articles yet</div>`}
  </div>
</section>`;

writePage(path.join("posts", "index.html"), layout({
  title: `Articles · ${siteName}`,
  description: "All articles from the constructivist static blog.",
  active: "posts",
  content: postsContent
}));

for (const post of posts) {
  const content = `<article class="page-hero">
    <div class="container page-hero-inner">
      <h1 class="page-title">${escapeHtml(post.title)}</h1>
      <div class="page-meta">
        <span class="tag">${escapeHtml(formatDate(post.date))}</span>
        ${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </div>
  </article>
  <div class="container article-layout">
    <article class="article-panel">
      ${post.cover ? `<img class="cover-image" src="${safeUrl(post.cover)}" alt="${escapeHtml(post.title)} cover">` : ""}
      <div class="markdown-body">${renderMarkdown(post.body)}</div>
    </article>
    <aside>
      <div class="sidebar-card">
        <h2 class="sidebar-title">All Articles</h2>
        <ul class="sidebar-list">
          ${posts.map((item) => `<li><a class="sidebar-link" href="${basePath}/posts/${escapeHtml(item.slug)}/">${escapeHtml(item.title)}</a></li>`).join("")}
        </ul>
      </div>
      <div class="sidebar-card">
        <h2 class="sidebar-title">Static Mode</h2>
        <p>No server, no database, no admin panel. This page is generated from Markdown.</p>
      </div>
    </aside>
  </div>`;

  writePage(path.join("posts", post.slug, "index.html"), layout({
    title: `${post.title} · ${siteName}`,
    description: post.excerpt || post.title,
    active: "posts",
    content
  }));
}

const aboutContent = `<section class="page-hero">
  <div class="container page-hero-inner">
    <h1 class="page-title">${escapeHtml(about.title)}</h1>
    <div class="page-meta"><span class="tag">GitHub Pages</span><span class="tag">Static</span><span class="tag">Constructivism</span></div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="about-panel markdown-body">${renderMarkdown(about.body)}</div>
  </div>
</section>`;

writePage(path.join("about", "index.html"), layout({
  title: `${about.title} · ${siteName}`,
  description: "About this constructivist static blog.",
  active: "about",
  content: aboutContent
}));

writePage("404.html", layout({
  title: `404 · ${siteName}`,
  description: "Page not found.",
  content: `<section class="section"><div class="container"><div class="empty-state">404 · Page Not Found</div></div></section>`
}));

const rfc2822 = (value) => new Date(`${value}T00:00:00Z`).toUTCString();
const xmlEscape = (value = "") => escapeHtml(value).replaceAll("'", "&apos;");

writeFileSync(path.join(outputDir, "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${xmlEscape(siteName)}</title><link>${siteUrl}</link><description>Constructivist static blog</description>${posts.map((post) => `<item><title>${xmlEscape(post.title)}</title><link>${siteUrl}/posts/${post.slug}/</link><guid>${siteUrl}/posts/${post.slug}/</guid><pubDate>${rfc2822(post.date)}</pubDate><description>${xmlEscape(post.excerpt || post.title)}</description></item>`).join("")}</channel></rss>\n`, "utf8");

const pages = ["", "posts/", "about/", ...posts.map((post) => `posts/${post.slug}/`)];
writeFileSync(path.join(outputDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${siteUrl}/${page}</loc></url>`).join("")}</urlset>\n`, "utf8");
writeFileSync(path.join(outputDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, "utf8");

cpSync(publicDir, outputDir, { recursive: true });
cpSync(staticDir, outputDir, { recursive: true });

console.log(`Static site generated: ${outputDir}`);
console.log(`Pages: ${pages.length + 1}`);
console.log(`Posts: ${posts.length}`);
console.log(`Base path: ${basePath || "/"}`);
