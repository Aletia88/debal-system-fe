/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.aceternity.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'debal-api.onrender.com',
          pathname: '/**',
        },
      ],
      
    },
  };
  
  export default nextConfig;