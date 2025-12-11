# Migration Checklist: Updating Layouts to Use Refactored Structure

## Overview
This checklist helps you migrate existing layouts to use the new shared partials and base CSS files.

## Pre-Migration Checklist

- [ ] Dependencies installed: `npm install`
- [ ] Backup existing layouts (or commit to git)
- [ ] Read [REFACTORING.md](REFACTORING.md) for full context
- [ ] Understand new partial structure

## For Each Layout File (classic.html, alt.html, pixels.html)

### 1. Update Head Section

#### Meta Tags
- [ ] **Find**: 
  ```html
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <link rel="icon" type="image/png" href="{{ "favicon.ico" | absURL }}">
  ```
- [ ] **Replace with**:
  ```html
  {{- partial "head/meta.html" . -}}
  ```

#### Title Tag
- [ ] **Find**:
  ```html
  <title>{{ .Title }} - One-page</title>
  ```
- [ ] **Replace with**:
  ```html
  {{- partial "head/title.html" . -}}
  ```

#### CSS Loading (One-Page Layouts)
- [ ] **Find**:
  ```html
  {{- $dict := dict "config" "postcss-config/one-page.config.js" }}
  {{- with resources.Get "css/one-page/styles.css" }}
    {{- $styles := . | postCSS $dict | minify }}
    <link rel="stylesheet" href="{{ $styles.Permalink | absURL }}">
  {{- end }}
  ```
- [ ] **Replace with**:
  ```html
  {{- $cssParams := dict "layoutName" "one-page" "includeFontAwesome" true -}}
  {{- partial "head/css-onepage.html" $cssParams -}}
  ```
- [ ] **Note**: Change `"one-page"` to `"one-page-alt"` or `"one-page-pixels"` as needed

### 2. Update Body Section

#### Body Class
- [ ] **Find**:
  ```html
  <body id="top-page" class="{{- if hugo.IsDevelopment -}}dev{{- else -}}prod{{- end -}}">
  ```
- [ ] **Replace with**:
  ```html
  <body id="top-page" class="{{- partial "site/body-class.html" . -}}">
  ```

#### Skip Links
- [ ] **Find**:
  ```html
  <a class="skip-link" href="#nav-menu">Skip to menu</a>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  ```
- [ ] **Replace with**:
  ```html
  {{- partial "accessibility/skip-links.html" . -}}
  ```

### 3. Update Footer Section

#### Classic Layout Footer
- [ ] **Find**:
  ```html
  <footer class="site-footer">
    <p>&copy; 2025 Nobody. <a href="#top-page"><i class="fa fa-arrow-circle-up fa-2x" aria-label="Top page"></i></a></p>
  </footer>
  ```
- [ ] **Replace with**:
  ```html
  {{- partial "site/footer.html" (dict "variant" "classic") -}}
  ```

#### Alt Layout Footer
- [ ] **Find**:
  ```html
  <footer id="footer" class="site-footer">
    <span>&copy; 2025 Nobody. </span><a href="#top-page" aria-label="Top page"><i class="fa fa-arrow-circle-up"></i></a>
  </footer>
  ```
- [ ] **Replace with**:
  ```html
  {{- partial "site/footer.html" (dict "variant" "alt") -}}
  ```

#### Pixels Layout Footer
- [ ] **Find**:
  ```html
  <footer class="site-footer">
    <p class="copyright"><span>&copy; 2025 Nobody</span>, <span>we Value Your Privacy</span></p>
    <button class="disappear btn-primary">Accept</button>
    <a href="#page-top"><span class="triangle reverse" aria-hidden="true">▼</span>Top page<span class="triangle reverse" aria-hidden="true">▼</span></a>
  </footer>
  ```
- [ ] **Replace with**:
  ```html
  {{- partial "site/footer.html" (dict "variant" "pixels") -}}
  ```

## For Each CSS File (styles.css in layout folders)

### 1. Classic Layout (one-page/styles.css)

- [ ] **Find**: Duplicate CSS reset at top (lines 1-~100)
- [ ] **Find**: Duplicate @font-face Inter declarations (lines ~101-~150)
- [ ] **Delete**: Both duplicate sections
- [ ] **Add at top**:
  ```css
  /* Import shared base styles */
  @import "../base/reset.css";
  @import "../base/fonts-inter.css";
  
  /* Classic layout styles */
  ```

### 2. Alt Layout (one-page-alt/styles.css)

- [ ] **Find**: Duplicate CSS reset at top
- [ ] **Find**: Duplicate @font-face Inter declarations
- [ ] **Delete**: Both duplicate sections
- [ ] **Add at top**:
  ```css
  /* Import shared base styles */
  @import "../base/reset.css";
  @import "../base/fonts-inter.css";
  
  /* Alt layout styles */
  ```

### 3. Pixels Layout (one-page-pixels/styles.css)

- [ ] **Find**: Duplicate CSS reset at top
- [ ] **Find**: Duplicate @font-face Press Start 2P declarations
- [ ] **Delete**: Both duplicate sections
- [ ] **Add at top**:
  ```css
  /* Import shared base styles */
  @import "../base/reset.css";
  @import "../base/fonts-pressstart2p.css";
  
  /* Pixels layout styles */
  ```

### 4. Remove Skip-Link CSS (if duplicated)

- [ ] **Find** in layout CSS:
  ```css
  .skip-link {
    position: absolute;
    top: -40px;
    /* ... */
  }
  ```
- [ ] **Delete**: Skip-link styles (now in base/reset.css)

## PostCSS Configuration Updates

All PostCSS configs have been updated, but verify:

### classic layout
- [ ] Check `postcss-config/one-page.config.js` includes:
  ```javascript
  content: ["./layouts/classic.html", "./layouts/_partials/**/*.html"],
  safelist: ["dev", "prod", "skip-link"]
  ```

### alt layout
- [ ] Check `postcss-config/one-page-alt.config.js` includes:
  ```javascript
  content: ["./layouts/alt.html", "./layouts/_partials/**/*.html"],
  safelist: ["dev", "prod", "skip-link"]
  ```

### pixels layout
- [ ] Check `postcss-config/one-page-pixels.config.js` includes:
  ```javascript
  content: ["./layouts/pixels.html", "./layouts/_partials/**/*.html"],
  safelist: ["dev", "prod", "skip-link"]
  ```

## Testing Checklist

### Build Tests
- [ ] Run `hugo --gc` (clear cache)
- [ ] Run `hugo` (production build)
- [ ] Check for build errors
- [ ] Verify `/public/` directory generated

### Development Tests
- [ ] Run `hugo server`
- [ ] Visit home page: http://localhost:1313/ai-layouts/
- [ ] Visit classic: http://localhost:1313/ai-layouts/classic/
- [ ] Visit alt: http://localhost:1313/ai-layouts/alt/
- [ ] Visit pixels: http://localhost:1313/ai-layouts/pixels/

### Visual Verification
- [ ] Check all layouts render correctly
- [ ] Verify fonts load properly
- [ ] Check skip links appear on focus
- [ ] Verify footer displays correctly
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Check smooth scrolling works
- [ ] Verify navigation links work

### Functionality Tests
- [ ] Test skip links (Tab key navigation)
- [ ] Test all internal links
- [ ] Verify images load
- [ ] Check icons display (FontAwesome)
- [ ] Test cookie banner (pixels layout)
- [ ] Verify debug bar appears (if enabled)

### CSS Verification
- [ ] Check that CSS is minified
- [ ] Verify unused styles are purged
- [ ] Check font-face declarations work
- [ ] Ensure no duplicate styles
- [ ] Verify responsive breakpoints work

### Code Quality
- [ ] Run `npm run lint:css`
  - [ ] Fix any errors
  - [ ] Or run `npm run lint:css:fix` for auto-fix
- [ ] Run `npm run lint:html`
  - [ ] Fix any errors
- [ ] Run `npm run format`
  - [ ] Verify formatting is consistent
- [ ] Run `npm run lint` (all linters)
  - [ ] Ensure all checks pass

### Browser Testing
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile device
- [ ] Verify no console errors

## Rollback Plan (If Needed)

If something goes wrong:

### Option 1: Git Revert
```bash
git checkout HEAD -- layouts/classic.html
git checkout HEAD -- layouts/alt.html
git checkout HEAD -- layouts/pixels.html
git checkout HEAD -- assets/css/
```

### Option 2: Keep Backup
Before starting, create backup:
```bash
cp -r layouts layouts.backup
cp -r assets/css assets-css.backup
```

To restore:
```bash
rm -rf layouts
mv layouts.backup layouts
rm -rf assets/css
mv assets-css.backup assets/css
```

## Post-Migration

### Cleanup
- [ ] Delete backup files (if using backup method)
- [ ] Clear Hugo cache: `hugo --gc`
- [ ] Verify git status: `git status`
- [ ] Review changes: `git diff`

### Documentation
- [ ] Update any custom documentation
- [ ] Note any layout-specific changes
- [ ] Document any issues encountered

### Commit
- [ ] Stage changes: `git add .`
- [ ] Commit: `git commit -m "Refactor: Migrate to shared partials and base CSS"`
- [ ] Push: `git push origin main`

### Deployment
- [ ] Verify GitHub Actions build succeeds
- [ ] Check deployed site: https://h0o0q.github.io/ai-layouts/
- [ ] Test all pages on production
- [ ] Verify no broken links

## Common Issues & Solutions

### Issue: CSS not loading
**Solution**: 
- Check @import paths are correct
- Verify base CSS files exist in `assets/css/base/`
- Clear Hugo cache: `hugo --gc`

### Issue: Fonts not displaying
**Solution**:
- Verify font preload partials are included
- Check font files exist in `/static/fonts/`
- Verify @font-face declarations in base CSS

### Issue: Partial not found
**Solution**:
- Check partial file exists in `layouts/_partials/`
- Verify partial path is correct
- Check file extension is `.html`

### Issue: PurgeCSS removing needed styles
**Solution**:
- Add class to safelist in PostCSS config
- Verify content paths include all HTML files
- Check that partials are in content array

### Issue: Linter errors
**Solution**:
- Run `npm run lint:css:fix` for auto-fix
- Check .stylelintrc.json for rules
- Add ignore comments for false positives

### Issue: Build fails
**Solution**:
- Check Hugo error message
- Verify all partials exist
- Check PostCSS config syntax
- Clear cache and rebuild

## Success Criteria

Migration is complete when:
- ✅ All layouts use shared partials
- ✅ All CSS imports base files
- ✅ No duplicate code remains
- ✅ All linters pass
- ✅ Site builds without errors
- ✅ All pages render correctly
- ✅ Tests pass
- ✅ Code is formatted
- ✅ Documentation updated
- ✅ Changes committed

## Estimated Time

- Small site (3 layouts): **1-2 hours**
- Medium site (5-10 layouts): **2-4 hours**
- Large site (10+ layouts): **4-8 hours**

## Getting Help

- Read [REFACTORING.md](REFACTORING.md) for details
- Check [QUICKSTART.md](QUICKSTART.md) for usage
- See [ARCHITECTURE.md](ARCHITECTURE.md) for structure
- Review [REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md) for overview

## Final Checklist

- [ ] All layouts migrated
- [ ] All CSS updated
- [ ] All tests pass
- [ ] Code quality checks pass
- [ ] Site works in production
- [ ] Documentation updated
- [ ] Changes committed
- [ ] Team notified (if applicable)

**🎉 Migration Complete!**
