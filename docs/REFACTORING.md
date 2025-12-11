# Theme Refactoring Documentation

## Overview
This document explains the refactored Hugo theme structure for better maintainability, reduced duplication, and improved code quality.

## Problems Solved

### Before Refactoring
- ❌ Duplicate HTML in every layout (head, footer, meta tags)
- ❌ Duplicate @font-face declarations in multiple CSS files
- ❌ Duplicate CSS resets across all stylesheets
- ❌ No code linting or formatting
- ❌ Inconsistent PostCSS configurations
- ❌ No shared partials for common sections
- ❌ Hard to maintain - changes required in multiple files

### After Refactoring
- ✅ DRY principle - shared code in partials
- ✅ Centralized base CSS (reset, fonts)
- ✅ Linters configured (Stylelint, HTMLHint, Prettier)
- ✅ Optimized PostCSS configs with autoprefixer
- ✅ Reusable partials for common elements
- ✅ Single source of truth for shared code
- ✅ Easy to maintain and extend

## New Directory Structure

```
├── assets/css/
│   ├── base/
│   │   ├── reset.css              # Shared CSS reset & skip-link styles
│   │   ├── fonts-inter.css        # Inter font declarations
│   │   └── fonts-pressstart2p.css # Press Start 2P font declarations
│   ├── home/
│   │   └── styles.css             # Home layout styles
│   ├── one-page/
│   │   └── styles.css             # Classic layout styles (import base files)
│   ├── one-page-alt/
│   │   └── styles.css             # Alt layout styles (import base files)
│   └── one-page-pixels/
│       └── styles.css             # Pixels layout styles (import base files)
│
├── layouts/
│   ├── _partials/
│   │   ├── accessibility/
│   │   │   └── skip-links.html    # Accessibility skip links
│   │   ├── head/
│   │   │   ├── meta.html          # Shared meta tags
│   │   │   ├── title.html         # Title generation logic
│   │   │   ├── css.html           # CSS loading (home layout)
│   │   │   ├── css-onepage.html   # CSS loading with PostCSS
│   │   │   └── fonts/preload/     # Font preload partials
│   │   ├── icons/                 # SVG icon partials
│   │   │   ├── bolt.html, magic.html, copy.html, laptop.html
│   │   │   ├── phone.html, envelope.html, arrow-up.html
│   │   │   └── code.html, server.html
│   │   ├── icon.html              # Icon wrapper (sizing, labels)
│   │   ├── site/
│   │   │   ├── footer.html        # Shared footer with variants
│   │   │   └── body-class.html    # Body class generation
│   │   ├── head.html              # Complete head partial
│   │   └── debug-bar/             # Debug bar module
│   ├── baseof.html                # Base template (home layout)
│   ├── home.html                  # Home layout
│   ├── classic.html               # Classic one-page layout
│   ├── alt.html                   # Alternative one-page layout
│   └── pixels.html                # Pixel-themed layout
│
├── postcss-config/
│   ├── one-page.config.js         # PostCSS config for classic
│   ├── one-page-alt.config.js     # PostCSS config for alt
│   └── one-page-pixels.config.js  # PostCSS config for pixels
│
├── postcss.config.base.js         # Base PostCSS config (autoprefixer, cssnano)
├── .stylelintrc.json              # Stylelint configuration
├── .htmlhintrc                    # HTMLHint configuration
├── .prettierrc.json               # Prettier configuration
└── .prettierignore                # Prettier ignore patterns
```

## Using Shared Partials

### In Layout Files

#### Meta Tags
```html
{{- partial "head/meta.html" . -}}
```

#### Title
```html
{{- partial "head/title.html" . -}}
```

#### CSS with PostCSS (One-Page Layouts)
```html
{{- $cssParams := dict "layoutName" "one-page" -}}
{{- partial "head/css-onepage.html" $cssParams -}}
```

#### Skip Links
```html
{{- partial "accessibility/skip-links.html" . -}}
```

#### Footer
```html
{{- $footerParams := dict "variant" "classic" -}}
{{- partial "site/footer.html" $footerParams -}}
```

#### Body Class
```html
<body class="{{- partial "site/body-class.html" . -}}">
```

## CSS Architecture

### Base Files (DRY)
Import base CSS files in layout-specific stylesheets:

```css
/* In assets/css/one-page/styles.css */
@import "../base/reset.css";
@import "../base/fonts-inter.css";

/* Layout-specific styles below */
.site-header {
  /* ... */
}
```

### Font Loading
- **Inter**: Used by classic and alt layouts
- **Press Start 2P**: Used by pixels layout

Font preloading partials:
- `layouts/_partials/head/fonts/preload/inter.html`
- `layouts/_partials/head/fonts/preload/start2p.html`

### Icon System
- **SVG Icons**: Inline SVG partials (replaced FontAwesome)
- **Icon Partials**: `layouts/_partials/icons/[name].html`
- **Icon Wrapper**: `layouts/_partials/icon.html`
- **Benefits**: Zero CSS overhead, instant loading, easy customization

## PostCSS Configuration

### Base Config
`postcss.config.base.js` provides:
- Autoprefixer for browser compatibility
- CSSNano for minification

### Layout-Specific Configs
Each layout has its own config extending the base:
- Targets specific layout HTML for PurgeCSS
- Includes partials in content path
- Maintains safelist for dynamic classes

Example:
```javascript
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    autoprefixer(),
    purgeCSSPlugin({
      content: ["./layouts/classic.html", "./layouts/_partials/**/*.html"],
      safelist: ["dev", "prod", "skip-link"]
    })
  ]
};
```

## Linting & Formatting

### Available Commands

```bash
# CSS Linting
npm run lint:css           # Check CSS with Stylelint
npm run lint:css:fix       # Auto-fix CSS issues

# HTML Linting
npm run lint:html          # Check HTML with HTMLHint

# All Linting
npm run lint               # Run all linters

# Formatting
npm run format             # Format all files with Prettier
npm run format:check       # Check formatting without changes
```

### Linter Configurations

#### Stylelint (.stylelintrc.json)
- Extends stylelint-config-standard
- Allows flexible class/ID naming patterns
- Configured for Hugo template compatibility

#### HTMLHint (.htmlhintrc)
- HTML5 doctype required
- Proper tag pairing and nesting
- Alt attributes required for images
- Title required in head

#### Prettier (.prettierrc.json)
- 100 character line width
- 2 spaces indentation
- Go-template parser for .html files
- Consistent formatting across all file types

## Migration Guide

### Updating Existing Layouts

1. **Replace meta tags** with partial:
   ```html
   <!-- Before -->
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   
   <!-- After -->
   {{- partial "head/meta.html" . -}}
   ```

2. **Replace footer** with partial:
   ```html
   <!-- Before -->
   <footer class="site-footer">...</footer>
   
   <!-- After -->
   {{- partial "site/footer.html" (dict "variant" "classic") -}}
   ```

3. **Update CSS imports** in stylesheets:
   ```css
   /* Add at top of layout CSS */
   @import "../base/reset.css";
   @import "../base/fonts-inter.css";
   
   /* Remove duplicate resets and font-faces */
   ```

4. **Use shared PostCSS config**:
   ```javascript
   // Update to include partials in PurgeCSS content
   content: ["./layouts/classic.html", "./layouts/_partials/**/*.html"]
   ```

## Best Practices

### When to Create a Partial
- Code used in 2+ layouts
- Logical component (nav, footer, meta)
- Configuration that might change
- Complex logic that clutters layout

### When NOT to Create a Partial
- Layout-specific unique content
- One-off styling or structure
- Performance-critical inline code

### Naming Conventions
- **Partials**: Descriptive, kebab-case (e.g., `skip-links.html`)
- **CSS files**: Match layout names (e.g., `one-page/styles.css`)
- **PostCSS configs**: Match layout names (e.g., `one-page.config.js`)

### CSS Organization
1. Import base files first
2. Define CSS custom properties
3. Layout-specific component styles
4. Media queries at end

## Testing Checklist

After refactoring, verify:
- [ ] All layouts render correctly
- [ ] CSS is properly minified and purged
- [ ] Fonts load correctly
- [ ] Skip links work
- [ ] Responsive design intact
- [ ] Accessibility features functional
- [ ] No linting errors
- [ ] Build completes without errors
- [ ] Dev and prod modes work

## Troubleshooting

### CSS not loading
- Check @import paths are correct (relative to CSS file)
- Verify PostCSS config includes all necessary content paths
- Clear Hugo cache: `hugo --gc`

### Fonts not appearing
- Verify font preload partial is included
- Check font-face declarations in base CSS
- Ensure font files exist in `/static/fonts/`

### Linter errors
- Run `npm run lint:fix` for auto-fixable issues
- Check linter configs for rule adjustments
- Some Hugo template syntax may need ignore comments

### PurgeCSS removing needed styles
- Add class names to safelist in PostCSS config
- Verify content paths include all relevant files
- Check that dynamic classes are properly safelisted

## Future Improvements

- [ ] Add more shared section partials (hero, contact, etc.)
- [ ] Create CSS utility classes library
- [ ] Add JavaScript linting (ESLint)
- [ ] Implement CSS modules or scoped styles
- [ ] Add automated visual regression testing
- [ ] Create component library documentation
- [ ] Add pre-commit hooks for linting
- [ ] Optimize font loading strategy further

## Resources

- [Hugo Partials Documentation](https://gohugo.io/templates/partials/)
- [PostCSS Documentation](https://postcss.org/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules/list)
- [PurgeCSS Configuration](https://purgecss.com/configuration.html)
- [Prettier Options](https://prettier.io/docs/en/options.html)
