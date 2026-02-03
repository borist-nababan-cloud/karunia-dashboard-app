/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "sharp$": false
    }

    // Exclude Google Maps from webpack processing
    config.externals = config.externals || []
    config.externals.push({
      'google.maps': 'google.maps'
    })

    return config
  }
}

module.exports = nextConfig