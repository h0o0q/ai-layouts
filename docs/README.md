# Documentation Index

Complete documentation for the refactored Hugo theme.

## Quick Links

### 🚀 Start Here
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running quickly with the refactored theme
- **[REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md)** - Overview of what changed and why

### 📚 In-Depth Guides
- **[REFACTORING.md](REFACTORING.md)** - Complete refactoring documentation with examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Visual diagrams showing the new structure
- **[MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md)** - Step-by-step guide to migrate layouts

## Documentation by Topic

### For New Users
1. Start with [REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md) to understand what changed
2. Read [QUICKSTART.md](QUICKSTART.md) for basic usage
3. Reference [ARCHITECTURE.md](ARCHITECTURE.md) to understand the structure

### For Migration
1. Read [REFACTORING.md](REFACTORING.md) to understand the new architecture
2. Follow [MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md) step by step
3. Use [QUICKSTART.md](QUICKSTART.md) as a reference during migration

### For Understanding
1. Review [ARCHITECTURE.md](ARCHITECTURE.md) for visual diagrams
2. Read [REFACTORING.md](REFACTORING.md) for detailed explanations
3. Check [REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md) for impact metrics

## File Descriptions

### QUICKSTART.md
Quick reference guide covering:
- Installation and setup
- Development workflow
- Using shared partials
- CSS architecture
- Linting commands
- Creating new layouts
- Common patterns
- Troubleshooting

**Best for**: Daily development tasks and quick lookups

### REFACTORING-SUMMARY.md
Executive summary including:
- Problems solved
- Files created
- Impact metrics (before vs after)
- Key takeaways
- What changed vs what stayed the same

**Best for**: Understanding the scope and impact of refactoring

### REFACTORING.md
Comprehensive guide with:
- Problem analysis
- Complete directory structure
- Using shared partials (with examples)
- CSS architecture details
- PostCSS configuration
- Linting setup
- Migration guide
- Best practices
- Troubleshooting
- Future improvements

**Best for**: Deep understanding and reference documentation

### ARCHITECTURE.md
Visual documentation featuring:
- Before/after diagrams
- Data flow diagrams
- Component relationships
- File dependency graphs
- Linting workflow
- Key improvements summary

**Best for**: Visual learners and understanding system design

### MIGRATION-CHECKLIST.md
Step-by-step migration guide:
- Pre-migration checklist
- Layout file updates
- CSS file updates
- PostCSS config updates
- Testing checklist
- Rollback plan
- Common issues & solutions
- Success criteria

**Best for**: Migrating existing layouts to use new structure

## Key Concepts

### DRY Principle (Don't Repeat Yourself)
- Shared partials eliminate duplicate HTML
- Base CSS files eliminate duplicate styles
- Single source of truth for common code

### Code Quality
- **Stylelint**: CSS linting
- **HTMLHint**: HTML validation
- **Prettier**: Code formatting
- All configured and ready to use

### Shared Partials
- `layouts/_partials/head/` - Meta tags, title, CSS loading
- `layouts/_partials/accessibility/` - Skip links
- `layouts/_partials/site/` - Footer, body classes

### Base CSS
- `assets/css/base/reset.css` - CSS reset
- `assets/css/base/fonts-inter.css` - Inter font
- `assets/css/base/fonts-pressstart2p.css` - Press Start 2P font

### PostCSS Optimization
- Autoprefixer for compatibility
- PurgeCSS for unused style removal
- CSSNano for minification
- Improved content paths

## Quick Commands

```bash
# Development
npm install          # Install dependencies
hugo server          # Start dev server

# Code Quality
npm run lint         # Run all linters
npm run lint:css     # Check CSS only
npm run lint:html    # Check HTML only
npm run format       # Format all code

# Build
hugo                 # Production build
hugo --gc            # Clear cache and build
```

## Getting Help

If you're stuck:
1. Check the relevant doc file above
2. Review code examples in REFACTORING.md
3. Look at troubleshooting sections
4. Check the migration checklist for similar issues

## Contributing to Docs

When updating documentation:
- Keep examples current
- Update cross-references
- Test all commands
- Include troubleshooting tips
- Add visual aids when helpful

## Navigation

- **Back to main README**: [../README.md](../README.md)
- **View all docs**: Browse this folder
- **Report issues**: Check troubleshooting sections first
