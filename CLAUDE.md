# Eterna Capital Website — Project Guide

## Architecture Overview

There are two copies of the website that must stay in sync:

```
/Users/nassimolive/Documents/Eterna/
├── website-prototypes/v13-deck-theme/   ← Original static HTML (local only, not on GitHub)
│   ├── index.html / index-light.html
│   ├── team.html / team-light.html
│   ├── portfolio.html / portfolio-light.html
│   ├── news.html / news-light.html
│   ├── news/*.html                      ← 55 article pages
│   ├── legal/*.html                     ← 3 legal pages (dark + light variants)
│   ├── images/                          ← 247 images
│   └── svgs/                            ← 6 SVG files
│
└── eterna-hugo/                         ← Hugo project → deployed to GitHub Pages
    ├── hugo.toml                        ← Site config (baseURL, menus, permalinks)
    ├── assets/css/
    │   ├── themes.css                   ← CSS custom properties (dark `:root` + `html.light-mode`)
    │   ├── main.css                     ← Shared styles (nav, footer, reveal, scroll progress)
    │   └── pages/                       ← Per-page CSS (home, team, portfolio, news-list, news-single, legal)
    ├── assets/js/
    │   ├── main.js                      ← Shared JS (nav toggle, theme toggle, reveal observer)
    │   ├── home.js                      ← Stats counter, card glow effects
    │   ├── team.js                      ← Bio expand/collapse
    │   └── portfolio.js                 ← Filter pills, tile glow
    ├── layouts/
    │   ├── _default/baseof.html         ← Base template (head, nav, footer, JS blocks)
    │   ├── index.html                   ← Homepage
    │   ├── _default/team.html           ← Team page
    │   ├── _default/portfolio.html      ← Portfolio page
    │   ├── news/list.html               ← News listing (3-tier: featured, secondary, archive)
    │   ├── news/single.html             ← Article page
    │   ├── legal/single.html            ← Legal pages
    │   ├── partials/                    ← head, nav, footer, scroll-progress, theme-toggle
    │   └── shortcodes/                  ← section-head, takeaway-list, inline-img, disclaimer
    ├── content/
    │   ├── _index.md                    ← Homepage (front matter only, template handles content)
    │   ├── team.md                      ← Team intro text (layout: "team")
    │   ├── portfolio.md                 ← Portfolio intro text (layout: "portfolio")
    │   ├── news/_index.md + 55 articles ← News articles with YAML front matter + raw HTML body
    │   └── legal/*.md                   ← 3 legal pages (layout: "legal")
    ├── data/
    │   ├── team.yml                     ← 5 team members (id, name, role, photo, bio, linkedin)
    │   ├── portfolio.yml                ← 36 companies (name, url, status: active/exit)
    │   └── featured_portfolio.yml       ← 8 featured companies for homepage
    ├── static/
    │   ├── images/                      ← All images (copied from v13-deck-theme)
    │   └── svgs/                        ← All SVGs (copied from v13-deck-theme)
    └── .github/workflows/deploy.yml     ← GitHub Actions: build Hugo + deploy to Pages
```

**GitHub repo**: `github.com/nassim-arch/eterna-website`
**Live site**: `https://nassim-arch.github.io/eterna-website/`

## Theme System

Dark mode is the CSS default (`:root` variables). Light mode is applied via `html.light-mode` class.

- **Default for new visitors**: Light mode (no localStorage value)
- **Toggle**: Clicking the sun/moon icon adds/removes `light-mode` class and saves to localStorage
- **FOUC prevention**: Blocking `<script>` in `<head>` checks localStorage before CSS loads
- **All colors** use CSS custom properties defined in `themes.css` — never hardcode colors in page CSS

## Sync Rule

**Any content change must be applied to BOTH the v13-deck-theme HTML files AND the Hugo project.**

The v13-deck-theme has separate dark/light HTML files for each page (e.g., `team.html` and `team-light.html`). Both must be updated when changing content.

---

## Common Tasks

### Add a New Portfolio Company

1. **Hugo** — Edit `data/portfolio.yml`, add entry in alphabetical order:
   ```yaml
   - name: Company Name
     url: "https://company.com"
     status: active
   ```

2. **Hugo** — If it should appear on the homepage, edit `data/featured_portfolio.yml` (max 8 entries):
   ```yaml
   - name: Company Name
     url: "https://company.com"
   ```

3. **Hugo** — Update the portfolio count in `layouts/_default/portfolio.html` (the filter pill counts)

4. **v13-deck-theme** — Add the `<a>` tile to both `portfolio.html` and `portfolio-light.html`, update filter counts

5. **v13-deck-theme** — If featured, add tile to both `index.html` and `index-light.html`

6. Build and push:
   ```bash
   cd /Users/nassimolive/Documents/Eterna/eterna-hugo
   hugo --gc --minify
   git add data/portfolio.yml data/featured_portfolio.yml
   git commit -m "Add [Company Name] to portfolio"
   git push origin main
   ```

### Mark a Company as Exited

1. **Hugo** — In `data/portfolio.yml`, change `status: active` to `status: exit`
2. **Hugo** — Update filter pill counts in `layouts/_default/portfolio.html`
3. **v13-deck-theme** — Add `<span class="tile-tag exit">Exit</span>` to the tile in both `portfolio.html` and `portfolio-light.html`, update counts

### Add a New News Article

1. Create `content/news/your-slug.md` with this front matter:
   ```yaml
   ---
   title: "Article Title"
   date: 2026-06-15
   category: "Insights"
   duration: "5 min"
   excerpt: "Brief description for listing page."
   heroImage: "image-filename.jpg"
   slug: "your-slug"
   ---
   ```

2. Add the article body as raw HTML below the front matter, using these classes:
   - `<h2 class="section-head">` for section headings (blue left border)
   - `<ul class="takeaway-list">` for bullet lists with blue dashes
   - `<figure class="inline-img"><img src="/eterna-website/images/filename.jpg"></figure>` for inline images
   - `<p class="disclaimer">` for disclaimers

3. Add the hero image to `static/images/`

4. **v13-deck-theme** — Create matching `news/your-slug.html` (dark) and optionally light variant. Update `news.html` and `news-light.html` listing pages.

5. Build and push:
   ```bash
   hugo --gc --minify
   git add content/news/your-slug.md static/images/image-filename.jpg
   git commit -m "Add [article title] news article"
   git push origin main
   ```

### Update a Team Member's Bio

1. **Hugo** — Edit `data/team.yml`, find the member by `id`, update the `bio` field
2. **v13-deck-theme** — Update the `<p>` inside `#bio-[id]` in both `team.html` and `team-light.html`
3. Build and push

### Add a New Team Member

1. **Hugo** — Add entry to `data/team.yml`:
   ```yaml
   - id: firstname
     firstName: First
     lastName: Last
     role: Title
     photo: photo-filename.jpg
     bio: "Bio text here."
     linkedin: "https://www.linkedin.com/in/handle/"
   ```

2. Add photo to `static/images/`

3. **v13-deck-theme** — Add `<article class="spotlight">` block to both `team.html` and `team-light.html`. Alternate `left-photo` / `right-photo` based on position.

### Update Homepage Content

- **Hero text**: Edit `layouts/index.html` (lines 8-9)
- **Stats values**: Edit `layouts/index.html` (the `data-count` attributes and static text)
- **Thesis text**: Edit `layouts/index.html` (the thesis-section)
- **Pillar text**: Edit `layouts/index.html` (the pillars section)
- **v13-deck-theme**: Mirror changes in both `index.html` and `index-light.html`

### Update Legal Pages

1. **Hugo** — Edit `content/legal/terms-and-conditions.md`, `privacy-policy.md`, or `disclaimer.md`
2. **v13-deck-theme** — Mirror in both dark and light HTML files under `legal/`

---

## Build & Deploy

### Local Preview
```bash
cd /Users/nassimolive/Documents/Eterna/eterna-hugo
hugo server
# Opens at http://localhost:1313/eterna-website/
```

### Deploy to GitHub Pages
```bash
hugo --gc --minify
git add [changed files]
git commit -m "Description of change"
git push origin main
# GitHub Actions builds and deploys automatically
```

### If Push is Rejected (Remote Ahead)
```bash
git pull --rebase origin main
git push origin main
```

---

## CSS Rules

- **Never hardcode colors** in page CSS files — always use `var(--variable-name)` from `themes.css`
- When adding a new color that differs between dark/light, add it to both `:root` and `html.light-mode` in `themes.css`
- Key variable groups: `--text`, `--muted`, `--bg`, `--border`, `--card-bg`, `--card-border`, `--card-glow`, `--card-hover-bg`, `--accent`, `--text-secondary`, `--text-tertiary`, `--img-bg`, `--img-border`, `--placeholder-from`, `--placeholder-to`
- CSS is bundled per-page via Hugo Pipes (defined in `layouts/partials/head.html`)

## Image Handling

- All images go in `static/images/` (Hugo) and `images/` (v13-deck-theme)
- Team photos: square aspect ratio, will get blue duotone filter applied via CSS
- News hero images: 16:9 or 16:10 aspect ratio
- SVGs go in `static/svgs/`
- Pillar icons are SVGs that get `filter: var(--pillar-icon-filter)` applied (inverts in light mode)

## Key Config

- `hugo.toml`: baseURL is `https://nassim-arch.github.io/eterna-website/`
- All internal links use `{{ relURL }}` or `{{ .RelPermalink }}` for correct path prefixing
- `markup.goldmark.renderer.unsafe = true` allows raw HTML in markdown content
- News articles use raw HTML body (not markdown) because the original content has specific CSS classes
