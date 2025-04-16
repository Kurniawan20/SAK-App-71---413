/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  trailingSlash: true,

  // Configure module imports
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/dashboards/overview',
        permanent: true
      },
      {
        source: '/:path',
        destination: '/en/:path',
        permanent: true,
        locale: false
      }
    ]
  },

  // Ignore build errors
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },

  // Configure webpack to exclude problematic modules
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add any problematic modules to exclude here
    }
    
    return config
  }
}

export default nextConfig
