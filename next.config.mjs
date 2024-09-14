// next.config.mjs
import nextPwa from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const withPWA = nextPwa({
  dest: 'public', // Output directory for the service worker and assets
  register: true, // Automatically registers the service worker
  skipWaiting: true, // Activate new SW as soon as it's available
  disable: !isProd, // Disable PWA functionality in development mode
});

export default withPWA({
  reactStrictMode: true, // Enable React Strict Mode
  swcMinify: true, // Enable SWC minification for faster builds
  // Other Next.js configurations go here
});
