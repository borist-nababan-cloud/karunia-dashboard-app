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

    // Ensure image files are properly handled for @react-pdf/renderer
    config.module.rules.push({
      test: /\.(jpg|jpeg|png|gif|svg)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name].[hash][ext]',
      },
    })

    return config
  }
}

module.exports = nextConfig