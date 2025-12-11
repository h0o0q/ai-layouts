# AI LAYOUTS

WebDev for fun.

## 🎉 Recently Refactored!

This theme has been refactored for better maintainability:
- ✅ Shared partials (DRY principle)
- ✅ Base CSS files (no duplication)
- ✅ Linters configured (Stylelint, HTMLHint, Prettier)
- ✅ Optimized PostCSS with autoprefixer
- ✅ Comprehensive documentation

**See [docs/REFACTORING-SUMMARY.md](docs/REFACTORING-SUMMARY.md) for what changed.**

## Quick Start

```bash
npm install           # Install dependencies (PostCSS, linters, etc.)
hugo server          # Start development server
```

Before committing:
```bash
npm run format       # Format code
npm run lint         # Check code quality
```

## Documentation

📖 **[View Documentation Index](docs/README.md)** - Complete guide to all documentation

### Getting Started
- **[QUICKSTART.md](docs/QUICKSTART.md)** - Quick reference guide
- **[MIGRATION-CHECKLIST.md](docs/MIGRATION-CHECKLIST.md)** - Migrate existing layouts

### Architecture & Details
- **[REFACTORING.md](docs/REFACTORING.md)** - Complete refactoring guide
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Visual diagrams and structure
- **[REFACTORING-SUMMARY.md](docs/REFACTORING-SUMMARY.md)** - What was accomplished

## Dummy Content

All child themes have dummy content deeply inspired (copy/paste) by the recent [rant by Hackernews](https://vibe-coded.lol/) about _AI Driven Development_.

## Commands

```bash
# Development
npm install          # Install all dependencies
hugo server          # Start dev server with live reload

# Code Quality
npm run lint         # Run all linters
npm run lint:css     # Check CSS
npm run lint:html    # Check HTML
npm run format       # Format all code

# Build
hugo                 # Production build to /public/
```

## Theme Structure

```
layouts/_partials/     # Shared components (NEW!)
├── head/             # Meta, title, CSS loading
├── accessibility/    # Skip links
└── site/            # Footer, body classes

assets/css/base/      # Shared CSS (NEW!)
├── reset.css        # CSS reset
├── fonts-inter.css  # Inter font
└── fonts-pressstart2p.css

assets/css/           # Layout-specific styles
├── home/
├── one-page/        # Classic layout
├── one-page-alt/    # Alternative layout
└── one-page-pixels/ # Pixel theme
```

## Features

- 🎨 Multiple layout variants (home, classic, alt, pixels)
- ♿ Accessibility-first (skip links, ARIA labels, semantic HTML)
- 📱 Responsive design
- 🚀 Optimized CSS (PostCSS + PurgeCSS)
- 🧹 Code quality (Stylelint, HTMLHint, Prettier)
- 📚 Comprehensive documentation
- 🔧 Easy to maintain and extend

## WARNING

This repository may not follow good practices, and is aimed to play with AI.

For example, the debug bar should not be visible in production.

### 16/11/2025

I made an experiment today, and it failed miserably.

I realized my prompts were inaccurate and my goal probably unrealistic, especially on free plans.

Even if I'm not a front-end dev, I've some background with these configurations.

I would be very hard for a complete beginner to detect and fix all glitches that happened during this test.

In that perspective, the rant is clearly right: overcomplicated structures that kinda obfuscate nasty bugs, wrong advices for a11y, etc.

However, I really do think it was simply not the right platform and the right prompts.

Next test will include local agents, riched context, and a real plan.

### 08/12/2025

**Theme refactored successfully!** 

Implemented DRY principles, shared partials, base CSS files, linters, and optimized PostCSS configuration. The codebase is now much more maintainable and follows best practices.

See the documentation files for complete details.

### 08/12/2025

Copilot & Claude to fix the project:

GOOD:
+ deep refactoring overall
+ nice tooling, and I asked for basic linters
+ nice fixes on shaky CSS rules and other tweaks not really well-supported
+ verbose documentation for the whole process in `docs/`
+ refactoring that removes many doublons and duplicates

BAD:
- errors on paths for font pixel arts (expected, but could be fixed just by asking Copilot)
- does not fix everything in one run, but you'd better split big modifications into smaller ones

=> I should be more specific in my prompts about the purge CSS config, as now it loads the whole fontawesome all the time, instead of getting only what's needed.

=> Fixed after indicating Copilot that the global approach with Fontawesome was wrong

=> It suggests using custom subsets of font svg instead of loading the CSS lib

=> Implemented: Replaced entire FontAwesome library (95KB CSS + fonts) with inline SVG icons (~3KB total)
   - Created 9 SVG icon partials for all used icons
   - Eliminated CSS dependency completely
   - Icons use currentColor for easy theming
   - 97% size reduction, better performance

