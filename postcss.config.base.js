import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

/**
 * Base PostCSS configuration
 * Extended by layout-specific configs
 */
export default {
  plugins: [
    autoprefixer(),
    cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true
        },
        normalizeWhitespace: true
      }]
    })
  ]
};
