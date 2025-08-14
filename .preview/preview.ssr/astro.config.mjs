import { defineConfig } from 'astro/config'
import clubs from '@devprotocol/clubs-core'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'
import { config } from 'dotenv'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

config({ path: './.env' })

export default defineConfig({
	output: 'server',
	integrations: [clubs(), vue(), svelte()],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@devprotocol/clubs-plugin-passports': fileURLToPath(
					new URL('../../src', import.meta.url),
				),
			},
		},
	},
})
