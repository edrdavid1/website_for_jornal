# Portfolio: Magazine SPA Engine (React + Hybrid CMS)

**Magazine Website Showcase** — A high-performance, modern Single Page Application (SPA) built with React 19, featuring a custom hybrid CMS architecture and zero-backend design.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)
![TypeScript](https://img.shields.io/badge/TypeScript-JSDoc-3178C6?logo=typescript)

---

## 📖 Table of Contents

- [Project Mission & Task](#project-mission--task)
- [Overview](#overview)
- [Why These Technologies?](#why-these-technologies)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Component Hierarchy](#component-hierarchy)
  - [Data Flow](#data-flow)
- [Key Features](#key-features)
  - [Multi-Language Support](#multi-language-support)
  - [Hybrid CMS (Markdown + JSON)](#hybrid-cms-markdown--json)
  - [Structured ID System](#structured-id-system)
  - [SEO Optimization & Prerendering](#seo-optimization)
  - [Performance Optimizations](#performance)
- [Content Management](#content-management)
- [Development & Scripts](#development)
- [Build & Deployment](#build--deployment)
- [Component Documentation](#component-documentation)
- [Hooks & Context](#hooks--context)
- [Styling Strategy](#styling)
- [Testing](#testing)
- [Scalability](#scalability)

---

## 🎯 Project Mission & Task

### The Challenge
The goal was to create a digital platform for a literary and art magazine that could handle long-form content and high-resolution art portfolios without the complexity and cost of a traditional CMS (like WordPress or Contentful) or a database backend.

### Key Requirements:
1. **Zero Hosting Costs**: The project must run entirely on static hosting (Cloudflare Pages).
2. **Offline-First Content Creation**: Authors and editors should be able to contribute by simply pushing Markdown files to Git.
3. **Professional Performance**: Near-instant page loads and perfect Lighthouse scores.
4. **Multilingual Architecture**: Full support for 4 languages (EN, RU, BE, LT) across all UI and content.
5. **SEO & Social Sharing**: Single Page Applications often struggle with SEO; this project needed a robust prerendering solution to ensure every article is crawlable and shareable.

---

## 🚀 Overview

This project is a technical demonstration of a **"Zero-Backend"** architecture. It treats the Git repository as the database and the build process as the data engine.

### Design Philosophy
1. **Security by Design**: Since there is no database or server-side code, the attack surface is effectively zero.
2. **Performance First**: Code splitting, lazy loading, and build-time image optimization ensure a premium user experience.
3. **Privacy-Focused**: No tracking, no third-party cookies, no external API dependencies.

---

## 🤔 Why These Technologies?

### React 19
- **Decision**: Used the latest concurrent features for seamless UI transitions.
- **Benefit**: Handles complex state (language context, fuzzy search, filtered lists) without performance bottlenecks.

### Vite 7
- **Decision**: Replaced traditional Webpack/CRA setup.
- **Benefit**: Provides instant HMR during development and extremely fast, optimized production builds using Rollup.

### Cloudflare Pages
- **Decision**: Deployment target for the production build.
- **Benefit**: Global Edge CDN ensures low latency regardless of user location, with automatic HTTPS and Git-integrated CI/CD.

### Markdown + Gray-Matter
- **Decision**: Content is stored in `.md` files with YAML frontmatter.
- **Benefit**: Full version control for content, zero cost for CMS services, and an easy workflow for writers using standard text editors.

### Fuse.js
- **Decision**: Client-side fuzzy search implementation.
- **Benefit**: Allows typo-tolerant, multi-language search across hundreds of articles without an external search API (like Algolia).

### CSS Modules
- **Decision**: Component-scoped styling.
- **Benefit**: Prevents naming collisions and ensures that only necessary CSS is loaded for each page.

---

## 🏗️ Architecture

### Project Structure

```
├── public/                          # Static assets & content source
│   ├── content/                     # Markdown content (SOURCE OF TRUTH)
│   │   ├── articles/                # Sample articles (MD files)
│   │   ├── authors/                 # Author profiles (MD files)
│   │   └── issues/                  # Issue metadata (MD files)
│   ├── fonts/                       # Custom web fonts
│   └── robots.txt, sitemap.xml      # SEO assets
│
├── src/
│   ├── components/                  # Atomic Design hierarchy
│   │   ├── blocks/                  # Complex page sections (Hero, ArticleSection)
│   │   ├── common/                  # Reusable UI (ArticleCard, SEO, Skeleton)
│   │   └── layout/                  # App shell (Header, Footer)
│   ├── constants/                   # i18n translations & config
│   ├── context/                     # Language state management
│   ├── data/                        # Generated JSON indexes (build-time output)
│   ├── hooks/                       # Custom logic (useArticles, useSearch)
│   ├── pages/                       # Route-level components
│   └── routes/                      # React Router configuration
│
├── scripts/                         # Build automation
│   ├── generate-index.js            # The "CMS Engine": MD → JSON conversion
│   ├── generate-sitemap.js          # SEO automation
│   └── prerender.cjs                # Puppeteer-based SSR pre-rendering
```

### Component Hierarchy

The application follows a strict hierarchical flow to ensure data consistency and efficient re-renders:

```
App.jsx
└── HelmetProvider
    └── LanguageProvider (Context)
        └── BrowserRouter
            ├── Header (Layout)
            ├── Routes (Home, Works, ArticleDetail, Author, etc.)
            └── Footer (Layout)
```

### Data Flow

The project uses a **Build-Time Data Pipeline**:
1. **Raw Data**: Markdown files in `public/content/`.
2. **Extraction**: `generate-index.js` parses frontmatter using `gray-matter`.
3. **Indexing**: Optimized JSON files are generated in `src/data/`.
4. **Consumption**: Components access data through custom hooks (`useArticles`, `useIssues`) which provide filtered, sorted, and translated results.

---

## ✨ Key Features

### Multi-Language Support
Full i18n implementation without external libraries like `i18next`. 
- **Languages**: English, Russian, Belarusian, Lithuanian.
- **Implementation**: Custom `LanguageContext` using React Context API for UI strings and content selection.

### Hybrid CMS (Markdown + JSON)
The build script validates content schema at build time. If an article is missing a required field (like `author_id` or `title`), the build fails, ensuring production data integrity.

### Structured ID System
Articles use a 18-digit ID format: `IIIIYYYYMMAAAAGGSS`.
- `IIII`: Issue ID
- `YYYYMM`: Date
- `AAAA`: Author ID
- `GG`: Genre code
- `SS`: Sequence
*Benefit*: Chronological sorting and metadata extraction are possible directly from the ID string.

### SEO Optimization & Prerendering
Since the project is an SPA, we use a custom Puppeteer script (`scripts/prerender.cjs`) to crawl the application and generate static HTML snapshots for every route. This ensures:
- **Rich Social Previews**: Open Graph and Twitter cards work perfectly.
- **Search Engine Indexing**: Bots receive full HTML content, not an empty `div#root`.

### Performance Optimizations
- **Image Pipeline**: `vite-plugin-image-optimizer` converts assets to WebP/AVIF during build.
- **Lazy Loading**: Every page is a separate dynamic import.
- **CLS Prevention**: `OptimizedImage` component uses aspect-ratio boxes to prevent layout shifts.

---

## 📝 Content Management

### Article Format
Articles are managed via standard Markdown files with extensive metadata:
```markdown
---
id: '000120260600010101'
author_id: '0001'
category: 'Prose'
isLatest: true
title:
  en: 'Work Title'
  ru: 'Название'
---
:::lang-en
# Content...
:::
```

---

## 🚀 Development

### Setup
```bash
git clone https://github.com/edrdavid1/website_for_jornal.git
npm install
npm run dev
```

### Scripts
- `npm run dev`: Starts dev server and watches MD files for index re-generation.
- `npm run build`: Full production build (Indexes → Sitemap → Vite).
- `npm run build:prerender`: Build + Static HTML generation for SEO.
- `npm run test`: Executes Vitest suite.

---

## 🧪 Testing
The project includes unit tests for core utilities and integration tests for the `LanguageProvider` and `useArticles` hook to ensure that translations and data filtering work across all supported languages.

---

## 📈 Scalability
The architecture is designed to support up to **2,000+ articles** and **500+ authors** before requiring a migration to a more traditional backend. The use of `Fuse.js` and build-time indexing ensures that even with hundreds of files, the application remains lightning-fast.
