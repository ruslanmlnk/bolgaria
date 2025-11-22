import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      graphql: path.resolve(__dirname, 'node_modules', 'graphql'),
    }

    // Ensure only one runtime copy of graphql is used in server bundles
    const externals = webpackConfig.externals || []
    webpackConfig.externals = Array.isArray(externals) ? [...externals, 'graphql'] : externals

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
