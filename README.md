# Journal — Digital Literary and Art Magazine Platform

This repository contains the source code of a real-world commercial project developed by me. I have official permission to showcase this code in my portfolio, provided that the company's name remains confidential. To respect the client's privacy, all company names, brandings, and sensitive credentials have been removed or anonymized.

**Journal** is a modern Single Page Application (SPA) built with React 19, featuring a unique **Hybrid CMS** architecture and a **Zero-Backend** design philosophy. It is designed as a high-performance, cost-effective, and secure solution for publishing long-form articles, literary works, and visual portfolios.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)

---

## 📖 Table of Contents

1. [Project Mission & Strategic Tasks](#1-project-mission--strategic-tasks)
2. [Why These Technologies? (Technical Rationale)](#2-why-these-technologies-technical-rationale)
   - [React 19 & Concurrent Mode](#react-19--concurrent-mode)
   - [Vite 7: The Speed Demon](#vite-7-the-speed-demon)
   - [Hybrid CMS: Markdown + JSON](#hybrid-cms-markdown--json)
   - [Client-Side Search: Fuse.js](#client-side-search-fusejs)
   - [CSS Modules: Performance Over Hype](#css-modules-performance-over-hype)
3. [Deep Architecture & Data Flow](#3-deep-architecture--data-flow)
   - [The "Build-Time Engine"](#the-build-time-engine)
   - [Runtime Data Access](#runtime-data-access)
   - [Project Structure (Tree View)](#project-structure-tree-view)
4. [The Structured ID System (Core Logic)](#4-the-structured-id-system-core-logic)
   - [Article ID Format (18 digits)](#article-id-format-18-digits)
   - [Author ID Format](#author-id-format)
   - [Genre Mapping](#genre-mapping)
5. [Key Features & Implementation Details](#5-key-features--implementation-details)
   - [Multi-Language Context (i18n)](#multi-language-context-i18n)
   - [Interactive Table of Contents (ScrollSpy)](#interactive-table-of-contents-scrollspy)
   - [Responsive & Optimized Images](#responsive--optimized-images)
   - [Share API Integration](#share-api-integration)
6. [Performance & SEO Strategy](#6-performance--seo-strategy)
   - [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
   - [Prerendering with Puppeteer](#prerendering-with-puppeteer)
   - [Image Optimization Pipeline](#image-optimization-pipeline)
7. [Content Management Workflow](#7-content-management-workflow)
   - [Article MD Schema](#article-md-schema)
   - [Author MD Schema](#author-md-schema)
   - [Issue MD Schema](#issue-md-schema)
8. [Component Documentation](#8-component-documentation)
   - [Layout Components](#layout-components)
   - [UI Components](#ui-components)
   - [Feature Components](#feature-components)
9. [Hooks & Global State (Context)](#9-hooks--global-state-context)
   - [useArticles](#usearticles)
   - [useArticleSearch](#usearticlesearch)
   - [LanguageContext](#languagecontext)
10. [Styling & Design System](#10-styling--design-system)
11. [Testing & Quality Assurance](#11-testing--quality-assurance)
12. [Scalability & Future Growth](#12-scalability--future-growth)
13. [Deployment & Environment Setup](#13-deployment--environment-setup)

---

## 1. Project Mission & Strategic Tasks

This project was developed as a high-performance alternative to traditional CMS platforms (like WordPress, Ghost, or Strapi) for digital publications. The primary goal was to create a platform that feels like a printed magazine — elegant, stable, and fast — but with the power of modern web technologies.

### The Problem it Solves:
1.  **Over-Engineering**: Most modern magazines use complex backends (Node.js, Python, PHP) and databases (PostgreSQL, MongoDB). This adds maintenance costs, security risks, and latency.
2.  **Slow Search**: Server-side search often feels sluggish. Users expect instant results.
3.  **Content Fragility**: Database-driven content is hard to version control. If the database crashes, the content is at risk.
4.  **SEO vs. SPA**: Standard SPAs often struggle with SEO, while SSR (Next.js) adds complexity.

### Strategic Solutions:
-   **Zero-Backend**: By moving all content to Markdown and indexing it at build-time, we eliminated the need for a server and database.
-   **Hybrid CMS**: We get the "Developer Experience" of Markdown and the "User Experience" of a fast React SPA.
-   **Git-as-a-Database**: Content authors use Git to manage articles, providing perfect version history and easy collaboration.
-   **Cost-Effectiveness**: The entire site can be hosted for $0 on Cloudflare Pages or GitHub Pages, handling millions of visitors with ease.

---

## 2. Why These Technologies? (Technical Rationale)

### React 19 & Concurrent Mode
While many projects are moving to Next.js, we chose **React 19** as a pure SPA. 
-   **Why**: Next.js (SSR) is overkill for a project where content changes only on deployment. React 19 provides the latest concurrent features, allowing us to maintain 60fps even when rendering massive 500k+ character articles with complex typography.
-   **Decision**: React's ecosystem (react-router, react-helmet-async) is more stable for long-term maintenance than specialized static generators.

### Vite 7: The Speed Demon
-   **Why**: Webpack is legacy. Vite's ESM-native approach provides near-instant HMR (Hot Module Replacement).
-   **Decision**: Vite 7's improved asset handling and faster builds were critical for the "Build-Time Engine" that generates our JSON indexes.

### Hybrid CMS: Markdown + JSON
-   **Why**: We rejected Headless CMS (Contentful, Sanity) because they introduce API latency and cost.
-   **Decision**: Using [gray-matter](https://github.com/jonschlinkert/gray-matter) to parse local Markdown files at build-time. This creates a "Static Site" feel with "Dynamic App" performance.

### Client-Side Search: Fuse.js
-   **Why**: Algolia is expensive; Meilisearch requires a server. 
-   **Decision**: With <2000 articles, a 200KB JSON index is negligible. **Fuse.js** provides typo-tolerant, multi-language fuzzy search instantly in the browser.

### CSS Modules: Performance Over Hype
-   **Why**: Tailwind adds a lot of utility classes to HTML; Styled-Components adds runtime overhead.
-   **Decision**: **CSS Modules** provide perfect scoping, zero runtime cost, and allow us to use modern CSS features like CSS Variables (`--main-color`) and Container Queries natively.

---

## 3. Deep Architecture & Data Flow

### The "Build-Time Engine"
The core of the project is [generate-index.js](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/scripts/generate-index.js). This script acts as our "Compiler".

**Process:**
1.  Scan `public/content/articles/`, `public/content/authors/`, and `public/content/issues/`.
2.  Parse Frontmatter using `gray-matter`.
3.  Validate data integrity (required fields, ID formats).
4.  Generate three JSON files in `src/data/`:
    -   `search-index.json`: Flat list of all articles with metadata.
    -   `authors-index.json`: Map of authors to their works.
    -   `issues-index.json`: Issue-specific metadata.

### Runtime Data Access
React components never touch Markdown files directly. They use **Custom Hooks** to query the pre-compiled JSON.
-   `useArticles()`: Provides filtered and translated lists of articles.
-   `useIssues()`: Manages issue-specific views and current issue state.

### Project Structure (Tree View)

```text
journal_website/
├── public/
│   ├── content/                # SOURCE OF TRUTH (Content)
│   │   ├── articles/           # *.md files (18-digit IDs)
│   │   ├── authors/            # *.md files (4-digit IDs)
│   │   └── issues/             # *.md files (Numbered)
│   ├── fonts/                  # Custom Typography (Bitter, Fira)
│   └── img/                    # Optimized UI/UX Assets
├── scripts/                    # BUILD AUTOMATION
│   ├── generate-index.js       # MD -> JSON Parser
│   ├── generate-sitemap.js     # SEO Sitemap Generator
│   └── prerender.cjs           # Puppeteer SSR Engine
├── src/
│   ├── components/             # ATOMIC DESIGN
│   │   ├── blocks/             # Large page sections
│   │   ├── common/             # Shared UI (SEO, Cards)
│   │   ├── layout/             # App Shell (Header, Footer)
│   │   └── ui/                 # Atomic elements (Buttons, Inputs)
│   ├── context/                # GLOBAL STATE
│   │   └── LanguageContext.jsx # i18n Engine
│   ├── data/                   # COMPILED DATA (Generated)
│   ├── hooks/                  # BUSINESS LOGIC
│   ├── pages/                  # ROUTE COMPONENTS
│   ├── routes/                 # ROUTING (React Router 7)
│   └── styles/                 # GLOBAL CSS & VARIABLES
├── vite.config.cjs             # BUILD PIPELINE
└── package.json                # DEPENDENCIES
```

---

## 4. The Structured ID System (Core Logic)

One of the most powerful features of this project is the **Structured ID System**. Instead of random UUIDs, we use semantic identifiers that encode metadata.

### Article ID Format (18 digits)
**Format:** `IIIIYYYYMMAAAAGGSS`

| Digits | Name | Description | Example |
| :--- | :--- | :--- | :--- |
| 1-4 | Issue ID | Which issue this article belongs to | `0001` |
| 5-8 | Year | Year of publication | `2026` |
| 9-10 | Month | Month of publication | `06` |
| 11-14 | Author ID | Unique identifier for the author | `0042` |
| 15-16 | Genre | Category code (Prose, Essay, etc.) | `01` |
| 17-18 | Sequence | Order within the issue/genre | `01` |

**Example ID:** `000120260600420101`
-   This article is in **Issue #1**, published in **June 2026**, by **Author #42**, is a **Prose (01)** piece, and is the **first** in its group.

### Author ID Format
Authors use a simple 4-digit ID (e.g., `0001`, `0042`). This ID is used to link articles in their `works_ids` array in the Markdown frontmatter.

### Genre Mapping
We use a centralized mapping to convert ID codes into human-readable categories across all 4 languages:
-   `01` -> Prose
-   `02` -> Essay
-   `03` -> Review
-   `04` -> Poetry
-   `05` -> Other (Interview, Art, etc.)

---

## 5. Key Features & Implementation Details

### Multi-Language Context (i18n)
Instead of using heavy libraries like `react-i18next`, we built a custom, lightweight [LanguageContext.jsx](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/src/context/LanguageContext.jsx).
-   **State**: Tracks current language (`en`, `ru`, `be`, `lt`).
-   **Persistence**: Automatically saves preference to `localStorage`.
-   **Translation Utility**: A `t()` function that handles nested keys and fallbacks.

### Interactive Table of Contents (ScrollSpy)
For long-form reading, we implemented a [TableOfContents](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/src/components/blocks/TableOfContents/TableOfContents.jsx) component.
-   **Logic**: Uses an Intersection Observer (via `useScrollSpy`) to highlight the active section as the user scrolls.
-   **Extraction**: A utility script [extractHeadings.js](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/src/utils/extractHeadings.js) parses the Markdown content at runtime to generate the list of links.

### Responsive & Optimized Images
We use an [OptimizedImage](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/src/components/common/OptimizedImage/OptimizedImage.jsx) component to handle all visuals.
-   **Lazy Loading**: Uses native `loading="lazy"`.
-   **CLS Prevention**: Forces aspect ratios to prevent Cumulative Layout Shift.
-   **Placeholders**: Displays a shimmer effect or low-res placeholder while the main image loads.

### Share API Integration
The [ShareButton](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/src/components/ui/ShareButton/ShareButton.jsx) uses the native **Web Share API**, allowing users to share articles directly to mobile apps (WhatsApp, Telegram, etc.) with a single click, falling back to "Copy Link" on desktop.

---

## 6. Performance & SEO Strategy

### Code Splitting & Lazy Loading
We use `React.lazy()` and `Suspense` for every route.
-   **Result**: The initial bundle size is < 150KB. Additional code for specific pages (like the Archive or Search) is only loaded when needed.

### Prerendering with Puppeteer
Since this is an SPA, we need to help SEO bots.
-   **Script**: [prerender.cjs](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/scripts/prerender.cjs) spins up a headless Chrome instance during build.
-   **Output**: It visits every route and saves the rendered HTML into the `dist` folder.
-   **Benefit**: Users get the SPA experience, while bots get static HTML.

### Image Optimization Pipeline
Images are processed via `vite-plugin-image-optimizer`.
-   **WebP/AVIF**: All images are converted to modern formats.
-   **Compression**: Up to 80% reduction in file size without visible loss in quality on retina displays.

---

## 7. Content Management Workflow

Authors manage content through simple Markdown files.

### Article MD Schema
```markdown
---
id: '000120260600010101'
issue: '1'
author_id: '0001'
title:
  en: 'English Title'
  ru: 'Русский заголовок'
category: 'Prose'
excerpt:
  en: 'Brief summary...'
---

:::lang-en
# Content in English
:::

:::lang-ru
# Контент на русском
:::
```

### Author MD Schema
```markdown
---
id: '0001'
name:
  en: 'Author Name'
---
Biography...
```

---

## 8. Component Documentation

### Layout Components
-   **Header**: Contains the dynamic logo and multi-language switcher.
-   **Footer**: Includes site map, legal links, and social icons.

### UI Components
-   **NavMenu**: A responsive sidebar/overlay for navigation.
-   **Pagination**: Custom logic for handling large lists of articles.
-   **Skeleton**: Loading states for cards and text blocks.

### Feature Components
-   **ArticleCard**: The primary display unit, optimized for hover effects and accessible typography.
-   **SEO**: A wrapper for `react-helmet-async` that manages OpenGraph tags dynamically.

---

## 9. Hooks & Global State (Context)

### useArticles
This is the workhorse of the app logic.
-   `all`: Returns all articles sorted by date.
-   `getArticleById(id)`: O(1) lookup for single article view.
-   `getArticlesByIssue(issueId)`: Filters the index for issue pages.

### useArticleSearch
Wraps **Fuse.js**.
-   **Fuzzy Matching**: Allows for typos (e.g., "jornal" matches "journal").
-   **Weighting**: Article titles have higher weight than excerpts.

---

## 10. Styling & Design System

The design system is built on **CSS Variables** located in [variables.css](file:///Users/dave/Prahramavannie/pelmeni_draniki/pelmeni_draniki/src/styles/variables.css).

-   **Typography**: Uses a mix of Serif (for reading) and Sans-Serif (for UI).
-   **Spacing**: A strict 8px grid system.
-   **Dark/Light Mode**: Foundation laid via CSS variables, ready for a toggle implementation.

---

## 11. Testing & Quality Assurance

We use **Vitest** for unit testing and **React Testing Library** for component testing.
-   **Focus**: We test critical paths like the `ID Parsing` logic and `Translation fallbacks`.
-   **CI**: Tests are run on every pull request to ensure no regressions in the data pipeline.

---

## 12. Scalability & Future Growth

-   **Backend Migration**: If the project grows to >10,000 articles, the `generate-index.js` script can be easily modified to push data to an ElasticSearch or Meilisearch instance.
-   **Dynamic Features**: The architecture is ready for **Firebase** or **Supabase** integration for user accounts or comments.

---

## 13. Deployment & Environment Setup

### Environment Requirements:
-   Node.js 20.x or higher
-   npm 10.x

### Quick Start:
```bash
git clone https://github.com/edrdavid1/website_for_jornal.git
cd website_for_jornal
npm install
npm run dev
```

### Production Build:
```bash
npm run build:prerender
```
The output will be in the `dist/` folder, ready for any static hosting provider.

---
*Developed by David. Portfolio project.*
