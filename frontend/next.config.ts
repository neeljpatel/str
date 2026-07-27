import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.hospitable.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/property/windy-city',
        destination: '/property/city-center-oasis',
        permanent: true,
      },
      {
        source: '/property/navy-pier',
        destination: '/property/luxurious-river-north',
        permanent: true,
      },
      {
        source: '/admin/gallery/windy-city',
        destination: '/admin/gallery/city-center-oasis',
        permanent: true,
      },
      {
        source: '/admin/gallery/navy-pier',
        destination: '/admin/gallery/luxurious-river-north',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
