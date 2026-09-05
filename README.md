# CONSTRUCTIVIST BLOG

一个大胆、前卫、可运行的个人 Blog 系统。项目采用构成主义 / Constructivism 视觉语言：红、黑、黄、蓝，高饱和色块，斜切结构，硬边框，偏移阴影，海报式排版。
## 静态 GitHub Pages 版本

除了完整动态版，本仓库也包含一条纯静态发布链路，适合部署到 GitHub Pages：

- 文章源文件：`content/posts/*.md`
- 关于页：`content/about.md`
- 静态样式：`static/styles.css`
- 构建脚本：`scripts/build-static.mjs`
- 部署工作流：`.github/workflows/pages.yml`

本地构建：

```powershell
npm run build:static
```

输出目录：

```text
dist/
```

静态版特点：

- 无数据库
- 无后台
- 无服务端 API
- 纯 HTML / CSS 输出
- 自动生成 `rss.xml`、`sitemap.xml`、`robots.txt`
- 推送到 `main` 后由 GitHub Actions 自动部署

新增文章时，在 `content/posts` 中添加 Markdown 文件并包含 front matter：

```md
---
title: 文章标题
slug: article-slug
date: 2026-09-05
tags: 设计, 前端
cover: /decorative-geometry.svg
excerpt: 文章摘要
---

正文内容...
```

## 功能

### 前台

- `/`：构成主义首页 Hero、最新已发布文章
- `/posts`：文章宣言墙
- `/posts/[slug]`：Markdown 文章详情
- `/about`：站点与站长介绍
- `/login`：管理员登录入口

### 后台

- `/admin`：仪表盘，显示文章、草稿、图片统计
- `/admin/posts`：文章列表、发布 / 草稿切换、编辑、删除
- `/admin/posts/new`：新建文章
- `/admin/posts/[id]/edit`：编辑文章
- `/admin/images`：图片上传、拖拽上传、粘贴上传、复制链接、删除

### 编辑器

- 左侧 Markdown 编辑，右侧实时预览
- 移动端可切换编辑 / 预览
- 工具栏支持标题、加粗、斜体、列表、引用、链接、代码块、表格、图片
- 支持上传本地图片并直接插入 Markdown
- 支持封面图 URL

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 前端 | Next.js 16 App Router + React 19 + TypeScript |
| 样式 | TailwindCSS 3 |
| 后端 | Next.js Route Handlers |
| 数据库 | SQLite + Prisma 6 |
| 认证 | JWT + HttpOnly Cookie |
| 密码 | bcryptjs |
| Markdown | react-markdown + remark-gfm |
| 图片 | 本地 `storage/uploads` 目录 |

## 环境要求

- Node.js `22.12+`
- npm `10+`
- Windows / macOS / Linux

项目初始化脚本使用 Node 内置 `node:sqlite` 创建 SQLite 数据库，因此需要 Node 22.12 或更高版本。

## 安装

```powershell
Set-Location D:\MyBlog\constructivist-blog
npm install
```

## 环境变量

项目已包含本地开发用 `.env`。模板文件为 `.env.example`：

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-random-32-byte-secret"
DEFAULT_ADMIN_USERNAME="test"
DEFAULT_ADMIN_PASSWORD="replace-before-production"
MAX_UPLOAD_SIZE_MB="10"
NEXT_PUBLIC_SITE_NAME="CONSTRUCTIVIST BLOG"
```

生产环境必须设置强随机的 `SESSION_SECRET`。

生成随机 Secret：

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## 数据库初始化

推荐直接运行：

```powershell
npm run db:init
```

该命令会执行：

1. `prisma generate`
2. 创建 `prisma/dev.db`
3. 创建数据表和索引
4. 如果管理员不存在，则创建默认管理员
5. 初始化默认站点设置

`npm run dev` 也会自动执行 `db:init`，因此首次运行可以直接使用：

```powershell
npm run dev
```

如果需要查看数据库：

```powershell
npm run db:studio
```

## 本地运行

```powershell
npm run dev
```

访问：

```text
http://localhost:3000
```

后台入口：

```text
http://localhost:3000/login
```

## 默认管理员

首次初始化时，如果管理员不存在，会根据 `.env` 中的 `DEFAULT_ADMIN_USERNAME` 与 `DEFAULT_ADMIN_PASSWORD` 创建。密码使用 bcryptjs 哈希存储，不会明文写入数据库。生产环境必须设置强密码。

## 生产构建

```powershell
npm run build
npm run start
```

生产环境建议部署在 HTTPS 之后，例如 Nginx、Caddy、Vercel Node Runtime、Docker 或其他 Node.js 服务器环境。

需要持久化以下内容：

```text
prisma/dev.db
storage/uploads/
```

不要把数据库文件或上传目录放到 publicly served static 目录中。本项目通过安全的 `/uploads/[filename]` Route Handler 提供图片访问。

## 图片上传

- 保存目录：`storage/uploads`
- 目录会自动创建，不需要手动创建
- 支持格式：`jpg`、`jpeg`、`png`、`gif`、`webp`、`svg`
- 单张默认最大：`10MB`
- 可通过 `MAX_UPLOAD_SIZE_MB` 配置
- 上传文件名会重命名为唯一值，避免覆盖和路径穿越
- SVG 响应带有 `Content-Security-Policy`，降低脚本执行风险

## API

### 认证

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### 前台文章

```text
GET /api/posts
GET /api/posts/[slug]
```

### 后台文章

```text
GET    /api/admin/posts
POST   /api/admin/posts
GET    /api/admin/posts/[id]
PUT    /api/admin/posts/[id]
DELETE /api/admin/posts/[id]
```

### 图片

```text
GET    /api/admin/images
POST   /api/admin/images
DELETE /api/admin/images/[id]
```

所有 `/api/admin/*` 接口都会校验登录状态，未登录返回 `401`。

## 安全说明

- 管理员密码使用 bcryptjs 哈希
- Session 使用 JWT 签名，并保存在 HttpOnly Cookie 中
- 后台页面和服务端接口均校验登录态
- Markdown 不启用原始 HTML 渲染，降低 XSS 风险
- Markdown 链接与图片 URL 只允许相对路径、HTTP、HTTPS、mailto
- 上传文件会校验 MIME Type、扩展名和大小
- 上传文件名会唯一化，不允许路径穿越
- SQLite 数据库和上传目录不会直接暴露为静态资源

## 目录结构

```text
constructivist-blog/
├─ prisma/
│  ├─ schema.prisma
│  ├─ init.sql
│  └─ seed.ts
├─ scripts/
│  └─ init-db.mjs
├─ storage/
│  └─ uploads/
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  ├─ admin/
│  │  ├─ api/
│  │  └─ uploads/
│  ├─ components/
│  ├─ lib/
│  └─ types/
├─ .env.example
├─ next.config.ts
├─ package.json
└─ tailwind.config.ts
```

## 验收清单

- [x] 本地运行成功
- [x] 可以使用 `.env` 中配置的管理员账号登录
- [x] 可以创建文章
- [x] 可以上传图片
- [x] 可以在 Markdown 中插入图片
- [x] 可以发布文章并在前台查看
- [x] 可以编辑和删除文章
- [x] 未登录无法访问后台接口
- [x] 移动端布局可用
- [x] 视觉风格符合构成主义、大胆前卫要求
