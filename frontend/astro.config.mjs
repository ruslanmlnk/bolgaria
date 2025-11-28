// @ts-check
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'

// Switch to a server build so API routes (POST /api/...) run at runtime.
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
})
