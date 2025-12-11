---
title: Home
---

## Goals

- Fun with UI Design
- Experiments

## Config

I use Hugo for built-in templating systems, easy postCSS config, and portability.

The only command used is `hugo server` with additional flags for development.

Everything else depends on postCSS config.

## PostCSS

I use a single, central PostCSS configuration (`postcss.config.js`) that Hugo Pipes uses when processing each stylesheet in `assets/css/`.

Example stylesheet paths:

```
assets/css/one-page/styles.css
assets/css/debug-bar/styles.css
```

## Debug bar

```
/assets/debug-bar/css/styles.css
/assets/debug-bar/postcss.config.js
```

It's a classic admin bar, with some useful infos and familiar styles.