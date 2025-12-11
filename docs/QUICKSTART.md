# Quick Start: Refactored Hugo Theme

## Installation

```bash
# Install all dependencies (PostCSS, linters, formatters)
npm install

# Update Hugo modules
hugo mod get -u
```

## Development Workflow

### Start Development Server
```bash
hugo server
```
Visit: http://localhost:1313/ai-layouts/

### Before Committing

```bash
# Format code
npm run format

# Check for errors
npm run lint

# Fix CSS issues automatically
npm run lint:css:fix
```

## Using Shared Partials

### Meta Tags
```html
<head>
  {{- partial "head/meta.html" . -}}
  {{- partial "head/title.html" . -}}
</head>
```

### CSS Loading (One-Page Layouts)
```html
{{- $params := dict "layoutName" "one-page" -}}
{{- partial "head/css-onepage.html" $params -}}
```

### Icons (SVG-based)
```html
<!-- Simple icon -->
{{- partial "icon.html" (dict "icon" "bolt") -}}

<!-- Sized icon -->
{{- partial "icon.html" (dict "icon" "magic" "size" "3x") -}}

<!-- With accessibility label -->
{{- partial "icon.html" (dict "icon" "arrow-up" "size" "2x" "label" "Top page") -}}
```

Available icons: bolt, magic, copy, laptop, phone, envelope, arrow-up, code, server

### Body Structure
```html
<body class="{{- partial "site/body-class.html" . -}}">
  {{- partial "accessibility/skip-links.html" . -}}
  
  <!-- Your content -->
  
  {{- partial "site/footer.html" (dict "variant" "classic") -}}
</body>
```

## CSS Architecture

### Layout Stylesheet Structure
```css
/* assets/css/one-page/styles.css */

/* 1. Import base files */
@import "../base/reset.css";
@import "../base/fonts-inter.css";

/* 2. CSS Custom Properties (if needed) */
:root {
  --color-primary: #007bff;
}

/* 3. Component styles */
.site-header {
  /* ... */
}

/* 4. Media queries */
@media (min-width: 768px) {
  /* ... */
}
```

### Available Base Files
- `base/reset.css` - CSS reset + skip-link styles
- `base/fonts-inter.css` - Inter variable font
- `base/fonts-pressstart2p.css` - Press Start 2P font

## PostCSS Configuration

Each layout has its own config in `/postcss-config/`:

```javascript
// postcss-config/one-page.config.js
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    autoprefixer(),
    purgeCSSPlugin({
      content: [
        "./layouts/classic.html",
        "./layouts/_partials/**/*.html"
      ],
      safelist: ["dev", "prod", "skip-link"]
    })
  ]
};
```

## Linting Commands

```bash
# CSS
npm run lint:css          # Check CSS
npm run lint:css:fix      # Auto-fix CSS issues

# HTML
npm run lint:html         # Check HTML

# All
npm run lint              # Run all linters

# Formatting
npm run format            # Format all files
npm run format:check      # Check without modifying
```

## Creating a New Layout

1. **Create layout file**: `/layouts/newlayout.html`
2. **Create CSS file**: `/assets/css/newlayout/styles.css`
   ```css
   @import "../base/reset.css";
   @import "../base/fonts-inter.css";
   
   /* Your styles */
   ```
3. **Create PostCSS config**: `/postcss-config/newlayout.config.js`
4. **Create content file**: `/content/newlayout.md`
   ```markdown
   ---
   title: New Layout
   layout: newlayout
   ---
   ```
5. **Add CSS partial to layout**:
   ```html
   {{- $params := dict "layoutName" "newlayout" "includeFontAwesome" true -}}
   {{- partial "head/css-onepage.html" $params -}}
   ```

## Common Patterns

### Passing Parameters to Partials
```html
{{- $footerParams := dict "variant" "classic" -}}
{{- partial "site/footer.html" $footerParams -}}
```

### Conditional Font Loading
```html
{{- partial "head/fonts/preload/inter.html" . -}}
{{- if .Params.useFontAwesome }}
  {{- partial "head/fonts/preload/fontawesome.html" . -}}
{{- end }}
```

### Dev/Prod Classes
```html
<body class="my-layout {{- partial "site/body-class.html" . -}}">
```
Outputs: `my-layout dev` or `my-layout prod`

## Troubleshooting

### CSS not updating
```bash
hugo --gc              # Clear cache
hugo server --noHTTPCache
```

### Linter errors
```bash
npm run lint:css:fix   # Fix CSS automatically
npm run format         # Format all files
```

### PostCSS errors
- Check config file syntax
- Verify import paths in CSS
- Ensure all plugins are installed

### Fonts not loading
- Check font files in `/static/fonts/`
- Verify @font-face paths in base CSS
- Include font preload partial in layout

## File Locations

```
Important files:
├── .stylelintrc.json          # CSS linting rules
├── .htmlhintrc                # HTML validation rules
├── .prettierrc.json           # Formatting config
├── postcss.config.base.js     # Base PostCSS config
├── REFACTORING.md             # Full documentation
│
├── assets/css/base/           # Shared CSS
│   ├── reset.css
│   ├── fonts-inter.css
│   └── fonts-pressstart2p.css
│
├── layouts/_partials/         # Shared templates
│   ├── head/
│   │   ├── meta.html
│   │   ├── title.html
│   │   └── css-onepage.html
│   ├── accessibility/
│   │   └── skip-links.html
│   └── site/
│       ├── footer.html
│       └── body-class.html
│
└── postcss-config/     # Layout-specific configs
    ├── one-page.config.js
    ├── one-page-alt.config.js
    └── one-page-pixels.config.js
```

## Next Steps

1. Install dependencies: `npm install`
2. Run linters: `npm run lint`
3. Format code: `npm run format`
4. Start dev server: `hugo server`
5. Read full documentation: [REFACTORING.md](REFACTORING.md)

## Resources

- **Full Documentation**: See [REFACTORING.md](REFACTORING.md)
- **Hugo Docs**: https://gohugo.io/documentation/
- **PostCSS**: https://postcss.org/
- **Stylelint**: https://stylelint.io/
