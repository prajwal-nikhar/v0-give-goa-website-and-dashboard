/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.replit.dev',
    '*.picard.replit.dev',
    '*.janeway.replit.dev',
    '*.repl.co',
  ],
}

export default nextConfig
