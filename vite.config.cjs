const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { ViteImageOptimizer } = require('vite-plugin-image-optimizer');

module.exports = defineConfig(async () => {
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    plugins: [
      react(),
      cloudflare(),
      ViteImageOptimizer({
        // WebP - best compatibility with good compression
        webp: {
          quality: 85, // High quality, no visible loss
          method: 6, // Best compression
        },
        // AVIF - best compression (fallback for unsupported browsers)
        avif: {
          quality: 80,
          speed: 6,
        },
        // Keep PNG for images with transparency
        png: {
          quality: 90,
        },
        // Keep JPG for photos
        jpg: {
          quality: 90,
        },
        // Exclude SVG (already optimized)
        exclude: ['**/*.svg', '**/icons/**'],
        // Log optimization stats
        logStats: true,
      }),
    ],
    build: {
      assetsInlineLimit: 1024, // Inline small images (<1kb)
      cssCodeSplit: true,
      minify: 'esbuild',
      sourcemap: false,
    },
  };
});
