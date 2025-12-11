# GitHub Copilot Instructions for AI Layouts

## Project Context
You are working on a Hugo static site project that experiments with AI-driven web development and multiple layout variants.

## Tech Stack
- **Static Site Generator**: Hugo 0.152.2+ (extended edition)
- **CSS Processing**: PostCSS CLI with @fullhuman/postcss-purgecss
- **Fonts**: Inter (variable font), Press Start 2P (pixel font)
- **Icons**: Inline SVG icons (custom partials)
- **Markup**: Hugo templates (Go templates)
- **Modules**: Hugo module system (github.com/h0o0q/hugo-debug-bar)
- **Package Manager**: npm
- **Deployment**: GitHub Actions → GitHub Pages
- **Go Version**: 1.25.4 (for Hugo modules)

## Code Style Preferences

### Hugo Templates (REFACTORED - DRY Principle)
- **Use shared partials** instead of duplicating code:
  - `{{- partial "head/meta.html" . -}}` for meta tags
  - `{{- partial "head/title.html" . -}}` for title generation
  - `{{- partial "accessibility/skip-links.html" . -}}` for skip links
  - `{{- partial "site/footer.html" (dict "variant" "classic") -}}` for footers
- Pass parameters to partials using `dict`
- Leverage partial templates for reusable components
- Use `baseof.html` for base template inheritance (home layout)
- Standalone layouts (classic, alt, pixels) import shared partials

### CSS & PostCSS Pipeline (REFACTORED)
- **Base CSS Files** (DRY - Don't Repeat Yourself):
  - `base/reset.css` - Shared CSS reset & skip-link styles
  - `base/fonts-inter.css` - Inter font @font-face declarations
  - `base/fonts-pressstart2p.css` - Press Start 2P font declarations

- **Layout-specific CSS** imports base files:
  ```css
  /* At top of layout stylesheet */
  @import "../base/reset.css";
  @import "../base/fonts-inter.css";
  
  /* Layout-specific styles below */
  ```

- **Separate stylesheets per layout**:
  - `home/styles.css` - Main home layout
  - `one-page/styles.css` - Classic single-page layout
  - `one-page-alt/styles.css` - Alternative single-page
  - `one-page-pixels/styles.css` - Pixel-art themed layout

- **PostCSS Processing** via shared partial:
  ```go
  {{- $cssParams := dict "layoutName" "one-page" -}}
  {{- partial "head/css-onepage.html" $cssParams -}}
  ```

- **PurgeCSS Configuration** (improved):
  - Targets layout HTML AND partials: `./layouts/_partials/**/*.html`
  - Safelist for dynamic classes: `["dev", "prod", "skip-link"]`
  - Removes unused CSS for optimized builds
  - Each layout has dedicated config in `/postcss-config/`

- **PostCSS Plugins** (optimized):
  - Autoprefixer for browser compatibility
  - PurgeCSS for removing unused styles
  - CSSNano for minification (via base config)

- **Styling Principles**:
  - Import base styles, don't duplicate
  - Mobile-first, responsive design
  - Smooth scrolling: `scroll-behavior: smooth`
  - Accessibility: skip-link styles in base

### Code Quality & Linting
- **Stylelint** - CSS linting with stylelint-config-standard
  - Config: `.stylelintrc.json`
  - Run: `npm run lint:css` or `npm run lint:css:fix`
  - Relaxed rules for Hugo template compatibility

- **HTMLHint** - HTML validation and best practices
  - Config: `.htmlhintrc`
  - Run: `npm run lint:html`
  - Checks: doctype, tag pairing, alt attributes, etc.

- **Prettier** - Code formatting (CSS, HTML, MD, JSON, JS)
  - Config: `.prettierrc.json`
  - Run: `npm run format` or `npm run format:check`
  - Uses go-template parser for Hugo .html files
  - 100 char line width, 2 spaces, no trailing commas

- **All linters**: Run `npm run lint` for full validation
- Always run linters before committing
- Use `lint:fix` and `format` for auto-fixes

## Important Patterns

### Template Architecture
1. **Home Layout** (uses base template):
   - `layouts/baseof.html` - Base structure
   - `layouts/home.html` - Defines blocks (header, main)
   - CSS loaded via `_partials/head/css.html`
   - Inherits head from `_partials/head.html`

2. **Standalone Layouts** (classic, alt, pixels):
   - Complete HTML documents (no baseof)
   - PostCSS processing inline in `<head>`
   - Direct font preloading
   - Each is self-contained

### Content → Layout Mapping
- Content files specify layout in frontmatter:
  ```markdown
  ---
  title: Layout OP Classic
  layout: classic
  ---
  ```
- Hugo uses this to select template from `/layouts/`
- `_index.md` uses `home.html` automatically

### Hugo Module Pattern (Debug Bar)
```toml
# config/_default/module.toml
[imports]
path = "github.com/h0o0q/hugo-debug-bar"
```
- Loaded in all layouts: `{{- partial "debug-bar/main.html" . -}}`
- Configuration in `params.toml`: `[HDB]` section
- Currently always visible (conditional commented out)

### Font Loading Strategy
1. **Preload** (in `<head>`):
   ```go
   {{- partial "head/fonts/preload/inter.html" . -}}
   ```
2. **Font-Face** (in CSS):
   - Declarations with unicode-range
   - Multiple weights/styles for variable fonts
3. **Per-Layout Fonts**:
   - Classic/Alt: Inter
   - Pixels: Press Start 2P
   - Home: System fonts only

### Icon System (SVG-based)
- **Icon Partials**: `layouts/_partials/icons/[name].html`
  - Individual SVG files for each icon
  - Inline SVG - no external CSS/fonts needed
  - Use `currentColor` for styling

- **Icon Wrapper**: `layouts/_partials/icon.html`
  ```go
  {{- partial "icon.html" (dict "icon" "bolt" "size" "3x") -}}
  {{- partial "icon.html" (dict "icon" "arrow-up" "size" "2x" "label" "Top page") -}}
  ```

- **Available Icons**:
  - bolt, magic, copy, laptop, phone, envelope, arrow-up, code, server

- **Benefits**:
  - Zero CSS overhead (was 95KB with FontAwesome)
  - Instant loading (inline with HTML)
  - Easy customization via CSS
  - Scalable at any size

### Asset URL Handling
- Always use `absURL` for production assets:
  ```go
  {{ $styles.Permalink | absURL }}
  ```
- Required for GitHub Pages subdirectory deployment
- Base URL: `https://h0o0q.github.io/ai-layouts/`
- Enabled by: `canonifyURLs = true`

### Conditional Rendering
```go
{{- if hugo.IsDevelopment -}}dev{{- else -}}prod{{- end -}}
```
- Add dev/prod classes to body
- Show/hide debug features
- Note: Debug bar currently always shown

### Accessibility Patterns
1. **Skip Links** (at start of body):
   ```html
   <a class="skip-link" href="#nav-menu">Skip to menu</a>
   <a class="skip-link" href="#main-content">Skip to main content</a>
   ```
2. **ARIA Labels**:
   - Interactive elements: `aria-label="Our services"`
   - Decorative elements: `aria-hidden="true"`
3. **Semantic HTML**:
   - `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
   - Proper heading hierarchy
4. **Focus Management**:
   - Visible focus states
   - Keyboard navigation support
5. **Screen Reader Support**:
   - Meaningful link text
   - Alt text for images
   - `<title>` tags in `<head>`

## Development Workflow

### Initial Setup
```bash
npm i                    # Install PostCSS dependencies
hugo mod get -u          # Update Hugo modules (debug-bar)
```

### Development Server
```bash
hugo server              # Start dev server
# - Live reload enabled
# - Serves at http://localhost:1313/ai-layouts/
# - Auto-processes CSS through PostCSS
# - Draft content visible
```

### Asset Processing Flow
1. Edit CSS in `/assets/css/[variant]/styles.css`
2. Hugo detects change
3. Runs through PostCSS pipeline:
   - Reads config from `/postcss-config/`
   - Applies PurgeCSS (targets layout HTML)
   - Minifies output
4. Browser auto-reloads

### Adding a New Layout Variant
1. Create layout: `/layouts/newlayout.html`
2. Create CSS: `/assets/css/new-layout/styles.css`
3. Create PostCSS config: `/postcss-config/new-layout.config.js`
   ```js
   import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
   export default {
     plugins: [
       purgeCSSPlugin({
         content: ['./layouts/newlayout.html']
       })
     ]
   }
   ```
4. Create content: `/content/newlayout.md` with `layout: newlayout`
5. Add PostCSS processing in layout `<head>`

### Production Build
```bash
hugo                     # Build to /public/
# - Minifies HTML
# - Processes all CSS
# - Applies PurgeCSS
# - Copies static assets
# - Generates final site
```

### Testing
- Test all layout variants: `/`, `/classic/`, `/alt/`, `/pixels/`
- Verify responsive design (mobile, tablet, desktop)
- Check accessibility (keyboard nav, screen readers)
- Validate skip links work
- Test in different browsers

### GitHub Actions Deployment
- Automatically deploys on push to main
- Uses Hugo 0.152.2 extended
- Installs npm dependencies
- Builds and deploys to GitHub Pages
- Available at: https://h0o0q.github.io/ai-layouts/

## What to Avoid

### CSS & Styling
- Don't mix layout-specific styles across variants
- Don't use inline styles; always use CSS files
- Don't forget `absURL` for asset paths (breaks GitHub Pages)
- Don't modify font files in `/static/fonts/` (use originals)
- Don't add global CSS; keep styles scoped to layouts

### Hugo Templates
- Don't break the template inheritance chain (home layout)
- Don't use baseof.html for new layouts (classic/alt/pixels don't)
- Don't forget to specify layout in content frontmatter
- Don't use relative paths for resources; use `resources.Get`
- Don't skip the PostCSS dict when processing CSS:
  ```go
  {{- $dict := dict "config" "path/to/postcss.config.js" }}
  ```

### PostCSS Configuration
- Don't share PostCSS configs between layouts
- Don't forget to update PurgeCSS content path when renaming layouts
- Don't disable minification in production
- Don't process CSS twice (once per layout is enough)

### Content & Configuration
- Don't modify baseURL without updating GitHub Pages settings
- Don't change Hugo version without testing build
- Don't remove `canonifyURLs = true` (needed for deployment)
- Don't commit sensitive data to params.toml

### Development
- Don't commit the `/public/` directory (build output)
- Don't commit `node_modules/` (npm dependencies)
- Don't commit `.hugo_build.lock` (build artifact)
- Don't test only in development mode; verify production builds
- Don't skip accessibility testing

### Module System
- Don't modify the debug-bar module code directly
- Don't remove module imports without cleaning up partials
- Don't forget to run `hugo mod get -u` after changing module.toml

## Common Tasks

### Update Font Files
1. Download new font files (woff2)
2. Place in `/static/fonts/[fontname]/`
3. Update font-face declarations in CSS
4. Update preload partials if needed

### Modify Debug Bar Position
```toml
# config/_default/params.toml
[HDB]
position = "bottom"  # or "top"
```

### Change Site Title
```toml
# config/_default/config.toml
title = 'NEW TITLE'
```

### Add Custom Parameter
```toml
# config/_default/params.toml
myNewParam = "value"
```
Access in templates: `{{ .Site.Params.myNewParam }}`

## Troubleshooting

### CSS Not Updating
- Clear Hugo cache: `hugo --gc`
- Check PostCSS config path in layout template
- Verify PurgeCSS content path matches layout filename
- Restart `hugo server`

### Fonts Not Loading
- Check font file paths in CSS (should be relative)
- Verify font files exist in `/static/fonts/`
- Check browser console for 404 errors
- Verify preload partial is included in layout

### Layout Not Applied
- Check frontmatter has: `layout: layoutname`
- Verify layout file exists: `/layouts/layoutname.html`
- Check Hugo output for template errors

### GitHub Pages 404
- Verify `baseURL` matches repository URL
- Ensure `canonifyURLs = true` is set
- Check GitHub Actions workflow succeeded
- Wait a few minutes for deployment

### Module Errors
- Run: `hugo mod get -u`
- Run: `hugo mod tidy`
- Check `go.mod` has correct module path

## Project Context & Philosophy

### Experimentation Notes
This is an experimental project exploring AI-assisted web development:
- Tests different AI coding assistant patterns
- Explores local agents with enriched context
- Documents learnings from AI development process
- Deliberately maintains visible debug information

### Content Theme
- Satirical take on "AI-coded" websites
- Inspired by vibe-coded.lol Hacker News discussion
- Intentionally humorous dummy content
- Highlights both benefits and pitfalls of AI development

### Code Quality Approach
While experimental, maintain:
- Proper semantic HTML
- Accessibility standards
- Performance optimization (PurgeCSS, minification)
- Clear code organization
- Comprehensive documentation

### Suggestions Welcome
Feel free to:
- Suggest creative layout improvements
- Recommend modern CSS features (custom properties, container queries)
- Propose Hugo optimization techniques
- Identify accessibility enhancements
- Recommend performance improvements
- Suggest better PostCSS configurations
- Propose alternative font loading strategies
