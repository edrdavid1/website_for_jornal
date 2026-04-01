# Portfolio: Magazine SPA (React + Hybrid CMS)

**Magazine Website Showcase** — A modern Single Page Application (SPA) built with React, featuring a hybrid CMS architecture and zero-backend design.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)
![TypeScript](https://img.shields.io/badge/TypeScript-JSDoc-3178C6?logo=typescript)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Why These Technologies?](#why-these-technologies)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Component Hierarchy](#component-hierarchy)
  - [Data Flow](#data-flow)
- [Key Features](#key-features)
  - [Multi-Language Support](#multi-language-support)
  - [Hybrid CMS](#hybrid-cms-markdown--json)
  - [Structured ID System](#structured-id-system)
  - [SEO Optimization](#seo-optimization)
  - [Performance](#performance)
- [Development](#development)
  - [Setup](#setup)
  - [Scripts](#scripts)
- [Build & Deployment](#build--deployment)
- [Component Documentation](#component-documentation)
- [Hooks & Context](#hooks--context)
- [Testing](#testing)

---

## 🎯 Overview

This project is a technical demonstration of a digital magazine platform focused on minimalist reading experience and high-quality visual portfolios. It showcases how to build a content-heavy application without a traditional database or backend server.

### Design Philosophy

1. **Zero-Backend**: All content is stored as Markdown files and processed at build time into JSON indexes. This ensures maximum security, zero hosting costs, and version-controlled content.
2. **Performance First**: Optimized for speed with code splitting, lazy loading, and build-time image processing.
3. **Multi-Language Architecture**: Built-in support for 4 languages (English, Russian, Belarusian, Lithuanian) with a custom i18n solution.
4. **Hybrid CMS**: Combines the ease of Markdown for writers with the power of React for the frontend.

---

## 🤔 Why These Technologies?

### React 19
- **Why**: Used for its concurrent rendering features and robust ecosystem. It handles complex UI states (like multi-language and filtering) efficiently.

### Vite 7
- **Why**: Provides an extremely fast development environment and optimized production builds.

### Markdown + Gray-Matter
- **Why**: Allows content to be managed as code. Frontmatter metadata is used to generate dynamic indexes, making the project "CMS-like" without the overhead.

### Fuse.js
- **Why**: Implements client-side fuzzy search, allowing users to find content instantly without any API calls.

---

## 🏗️ Architecture

### Project Structure

```
├── public/                          # Static assets & content source
│   ├── content/                     # Markdown content (SOURCE OF TRUTH)
│   │   ├── articles/                # Sample articles
│   │   ├── authors/                 # Author profiles
│   │   └── issues/                  # Issue metadata
│
├── src/
│   ├── components/                  # Atomic Design hierarchy
│   ├── constants/                   # Static config & translations
│   ├── context/                     # Language state management
│   ├── data/                        # Generated JSON indexes
│   ├── hooks/                       # Data access & UI logic
│   ├── pages/                       # Route components
│   └── routes/                      # React Router configuration
│
├── scripts/                         # Build automation
│   ├── generate-index.js            # MD → JSON conversion
│   ├── generate-sitemap.js          # SEO automation
│   └── prerender.cjs                # SSR pre-rendering
```

---

## ✨ Key Features

### Multi-Language Support
Implemented via a custom `LanguageProvider` using React Context. It handles both UI strings and Markdown content switching.

### Hybrid CMS (Markdown + JSON)
A custom build pipeline (`scripts/generate-index.js`) parses Markdown frontmatter and creates optimized JSON search indexes. This provides the speed of static data with the flexibility of a CMS.

### SEO Optimization
- **Dynamic Meta Tags**: Using `react-helmet-async`.
- **Prerendering**: A Puppeteer script generates static HTML for search engines and social crawlers.
- **Sitemap**: Automatically generated based on content files.

### Performance
- **Image Optimization**: Automatic conversion to WebP/AVIF during build.
- **Lazy Loading**: All pages and off-screen images are loaded on demand.
- **Minimal Bundle**: ~200 KB gzipped total.

---

## 🚀 Development

### Setup

```bash
# 1. Clone repository
git clone https://github.com/edrdavid1/website_for_jornal.git
cd website_for_jornal

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (with index generation) |
| `npm run build` | Production build (indexes + sitemap + Vite) |
| `npm run build:prerender` | Full build with Puppeteer SSR pre-rendering |
| `npm run test` | Run Vitest suite |

---

## 🏗️ Build & Deployment

The build process is automated to ensure data consistency:
1. **MD Parsing**: Extract metadata from content files.
2. **Validation**: Ensure all required fields exist.
3. **Index Generation**: Write optimized JSON files to `src/data/`.
4. **Asset Optimization**: Process images and minify JS/CSS.
5. **Prerendering**: Create static entry points for SEO.

Deployment is optimized for **Cloudflare Pages** or any static hosting provider.

---

## 🧩 Component & Hook Highlights

- **`useArticles`**: A custom hook that abstracts data fetching and translation logic.
- **`OptimizedImage`**: Prevents Layout Shift (CLS) and handles lazy loading.
- **`TableOfContents`**: Automatically extracts headings from Markdown for easy navigation.

---

## 🧪 Testing

The project uses **Vitest** and **React Testing Library** for unit and integration tests, focusing on core logic like localization and data filtering.
