import { defineConfig } from 'astro/config'
import clubs from '@devprotocol/clubs-core'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'
import { config } from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

config({ path: './.env' })

export default defineConfig({
	output: 'server',
	integrations: [clubs(), vue(), svelte(), tailwindcss()],
})
