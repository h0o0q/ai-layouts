# Theme Architecture Diagram

## Before Refactoring (Problematic)

```
layouts/
├── classic.html (288 lines)
│   ├── Duplicate: <head> meta tags
│   ├── Duplicate: <title> logic
│   ├── Duplicate: Font preload
│   ├── Duplicate: PostCSS inline
│   ├── Duplicate: Skip links
│   └── Duplicate: Footer
│
├── alt.html (324 lines)
│   ├── Duplicate: <head> meta tags
│   ├── Duplicate: <title> logic
│   ├── Duplicate: Font preload
│   ├── Duplicate: PostCSS inline
│   ├── Duplicate: Skip links
│   └── Duplicate: Footer
│
└── pixels.html (205 lines)
    ├── Duplicate: <head> meta tags
    ├── Duplicate: <title> logic
    ├── Duplicate: Font preload
    ├── Duplicate: PostCSS inline
    ├── Duplicate: Skip links
    └── Duplicate: Footer

assets/css/
├── one-page/styles.css
│   ├── Duplicate: CSS reset (~100 lines)
│   ├── Duplicate: @font-face Inter (~50 lines)
│   └── Layout styles
│
├── one-page-alt/styles.css
│   ├── Duplicate: CSS reset (~100 lines)
│   ├── Duplicate: @font-face Inter (~50 lines)
│   └── Layout styles
│
└── one-page-pixels/styles.css
    ├── Duplicate: CSS reset (~100 lines)
    ├── Duplicate: @font-face Press Start 2P (~50 lines)
    └── Layout styles

❌ Problems:
- ~450+ lines of duplicate code
- Change once = edit 3+ files
- High maintenance burden
- Inconsistencies likely
- No linting
- No code quality checks
```

## After Refactoring (Optimized)

```
layouts/_partials/          ← NEW: Shared Components
├── head/
│   ├── meta.html          ← Shared meta tags
│   ├── title.html         ← Title generation logic
│   ├── css.html           ← Home layout CSS
│   ├── css-onepage.html   ← PostCSS loading
│   └── fonts/preload/
│       ├── inter.html
│       └── start2p.html
│
├── icons/                 ← NEW: SVG Icon Partials
│   ├── bolt.html, magic.html, copy.html
│   ├── laptop.html, phone.html, envelope.html
│   ├── arrow-up.html, code.html, server.html
│   └── (9 inline SVG icons)
│
├── icon.html              ← Icon wrapper (sizing, a11y)
│
├── accessibility/
│   └── skip-links.html    ← Shared skip links
│
└── site/
    ├── footer.html        ← Shared footer (variants)
    └── body-class.html    ← Dev/prod class

layouts/
├── classic.html
│   ├── {{- partial "head/meta.html" . -}}
│   ├── {{- partial "head/title.html" . -}}
│   ├── {{- partial "head/css-onepage.html" $params -}}
│   ├── {{- partial "accessibility/skip-links.html" . -}}
│   ├── Unique content
│   └── {{- partial "site/footer.html" $params -}}
│
├── alt.html
│   ├── {{- partial "head/meta.html" . -}}
│   ├── {{- partial "head/title.html" . -}}
│   ├── {{- partial "head/css-onepage.html" $params -}}
│   ├── {{- partial "accessibility/skip-links.html" . -}}
│   ├── Unique content
│   └── {{- partial "site/footer.html" $params -}}
│
└── pixels.html
    ├── {{- partial "head/meta.html" . -}}
    ├── {{- partial "head/title.html" . -}}
    ├── {{- partial "head/css-onepage.html" $params -}}
    ├── {{- partial "accessibility/skip-links.html" . -}}
    ├── Unique content
    └── {{- partial "site/footer.html" $params -}}

assets/css/base/           ← NEW: Shared CSS
├── reset.css              ← Single CSS reset
├── fonts-inter.css        ← Single Inter declaration
└── fonts-pressstart2p.css ← Single Press Start 2P

assets/css/
├── one-page/styles.css
│   ├── @import "../base/reset.css";
│   ├── @import "../base/fonts-inter.css";
│   └── Layout-specific styles
│
├── one-page-alt/styles.css
│   ├── @import "../base/reset.css";
│   ├── @import "../base/fonts-inter.css";
│   └── Layout-specific styles
│
└── one-page-pixels/styles.css
    ├── @import "../base/reset.css";
    ├── @import "../base/fonts-pressstart2p.css";
    └── Layout-specific styles

Linters & Tools            ← NEW: Code Quality
├── .stylelintrc.json      ← CSS linting
├── .htmlhintrc            ← HTML validation
├── .prettierrc.json       ← Code formatting
└── postcss.config.base.js ← Shared PostCSS

✅ Benefits:
- ~450+ lines saved
- Change once = applies everywhere
- Low maintenance
- Consistent everywhere
- Linting enforced
- High code quality
```

## Data Flow Diagram

### CSS Processing Pipeline

```
Layout Stylesheet (e.g., one-page/styles.css)
    │
    ├─→ @import "../base/reset.css"
    │       └─→ CSS reset + skip-link styles
    │
    ├─→ @import "../base/fonts-inter.css"
    │       └─→ @font-face declarations
    │
    └─→ Layout-specific styles
            │
            ▼
    Hugo Pipes (resources.Get)
            │
            ▼
    PostCSS Processing
    ├─→ Autoprefixer (browser compatibility)
    ├─→ PurgeCSS (remove unused)
    │   ├─→ Scans: layouts/classic.html
    │   ├─→ Scans: layouts/_partials/**/*.html
    │   └─→ Keeps: safelist classes (dev, prod, skip-link)
    └─→ Minify
            │
            ▼
    Optimized CSS Output
            │
            ▼
    <link rel="stylesheet" href="{{ .Permalink | absURL }}">
```

### Partial Usage Flow

```
Layout File (classic.html)
    │
    ├─→ {{- partial "head/meta.html" . -}}
    │       └─→ Renders: <meta> tags
    │
    ├─→ {{- partial "head/title.html" . -}}
    │       └─→ Renders: <title> with logic
    │
    ├─→ {{- $params := dict "layoutName" "one-page" -}}
    │   {{- partial "head/css-onepage.html" $params -}}
    │       └─→ Processes CSS with PostCSS
    │
    ├─→ {{- partial "accessibility/skip-links.html" . -}}
    │       └─→ Renders: Skip navigation links
    │
    └─→ {{- $footer := dict "variant" "classic" -}}
        {{- partial "site/footer.html" $footer -}}
            └─→ Renders: Footer (variant-specific)
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────┐
│                   Hugo Site Build                        │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    Layouts           Partials              CSS
        │                  │                  │
        │                  │                  │
   ┌────┴────┐        ┌────┴────┐       ┌────┴────┐
   │ classic │        │  head/  │       │  base/  │
   │   alt   │───────→│  site/  │       │ one-pg/ │
   │ pixels  │        │  a11y/  │       │  fonts/ │
   └─────────┘        └─────────┘       └─────────┘
        │                  │                  │
        │                  │                  │
        └──────────┬───────┴────────┬─────────┘
                   │                │
                   ▼                ▼
              PostCSS          Linters
            Processing       (Validation)
                   │                │
                   └────────┬───────┘
                            │
                            ▼
                    Optimized Output
                            │
                            ▼
                    public/ Directory
                            │
                            ▼
                    GitHub Pages
```

## File Dependency Graph

```
classic.html
├── requires: _partials/head/meta.html
├── requires: _partials/head/title.html
├── requires: _partials/head/css-onepage.html
│   ├── requires: postcss-config/one-page.config.js
│   └── processes: assets/css/one-page/styles.css
│       ├── imports: assets/css/base/reset.css
│       └── imports: assets/css/base/fonts-inter.css
├── requires: _partials/head/fonts/preload/inter.html
├── requires: _partials/icon.html (for icons)
│   └── requires: _partials/icons/*.html (SVG icons)
├── requires: _partials/accessibility/skip-links.html
├── requires: _partials/site/footer.html
└── requires: _partials/debug-bar/main.html (Hugo module)

alt.html
├── requires: _partials/head/meta.html (SHARED ✅)
├── requires: _partials/head/title.html (SHARED ✅)
├── requires: _partials/head/css-onepage.html (SHARED ✅)
│   ├── requires: postcss-config/one-page-alt.config.js
│   └── processes: assets/css/one-page-alt/styles.css
│       ├── imports: assets/css/base/reset.css (SHARED ✅)
│       └── imports: assets/css/base/fonts-inter.css (SHARED ✅)
├── requires: _partials/head/fonts/preload/inter.html (SHARED ✅)
├── requires: _partials/icon.html (SHARED ✅)
│   └── requires: _partials/icons/*.html (SHARED ✅)
├── requires: _partials/accessibility/skip-links.html (SHARED ✅)
├── requires: _partials/site/footer.html (SHARED ✅)
└── requires: _partials/debug-bar/main.html (SHARED ✅)

pixels.html
├── requires: _partials/head/meta.html (SHARED ✅)
├── requires: _partials/head/title.html (SHARED ✅)
├── requires: _partials/head/css-onepage.html (SHARED ✅)
│   ├── requires: postcss-config/one-page-pixels.config.js
│   └── processes: assets/css/one-page-pixels/styles.css
│       ├── imports: assets/css/base/reset.css (SHARED ✅)
│       └── imports: assets/css/base/fonts-pressstart2p.css
├── requires: _partials/head/fonts/preload/start2p.html
├── requires: _partials/accessibility/skip-links.html (SHARED ✅)
├── requires: _partials/site/footer.html (SHARED ✅)
└── requires: _partials/debug-bar/main.html (SHARED ✅)
```

## Linting Workflow

```
Developer writes code
        │
        ▼
    Save file
        │
        ├─→ CSS File?
        │   └─→ Stylelint checks (.stylelintrc.json)
        │       ├─→ Rules: standard config
        │       ├─→ Auto-fix available
        │       └─→ Reports errors/warnings
        │
        ├─→ HTML File?
        │   └─→ HTMLHint checks (.htmlhintrc)
        │       ├─→ Validates structure
        │       ├─→ Checks accessibility
        │       └─→ Reports errors
        │
        └─→ Any File?
            └─→ Prettier formats (.prettierrc.json)
                ├─→ Consistent style
                ├─→ Go-template parser for .html
                └─→ Auto-format on save

    Before commit:
        ├─→ npm run lint (check all)
        ├─→ npm run format (format all)
        └─→ npm run lint:fix (auto-fix CSS)
```

## Key Improvements Summary

| Aspect | Before | After | Impact |
|--------|--------|-------|--------|
| **Duplication** | 3× everywhere | Shared partials | ✅ DRY |
| **Maintenance** | Edit 3+ files | Edit 1 file | ✅ Easy |
| **Consistency** | Manual sync | Automatic | ✅ Reliable |
| **Quality** | No checks | 3 linters | ✅ High |
| **CSS** | Repeated resets | Base imports | ✅ Clean |
| **PostCSS** | Basic | Optimized | ✅ Better |
| **Docs** | Minimal | Comprehensive | ✅ Clear |
