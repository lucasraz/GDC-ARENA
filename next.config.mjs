/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lncimg.lance.com.br' },
      { protocol: 'https', hostname: 's2-extra.glbimg.com' },
      { protocol: 'https', hostname: 'i.s3.glbimg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
