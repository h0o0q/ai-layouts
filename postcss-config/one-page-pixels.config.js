import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    autoprefixer(),
    purgeCSSPlugin({
      content: [
        "./layouts/pixels.html",
        "./layouts/_partials/**/*.html"
      ],
      safelist: ["dev", "prod", "skip-link"]
    })
  ]
};
