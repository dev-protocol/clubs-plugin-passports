import { defineConfig } from 'astro/config'
import clubs from '@devprotocol/clubs-core'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import { config } from 'dotenv'

config({ path: './.env' })

export default defineConfig({
	integrations: [clubs(), vue(), svelte(), tailwind()],
	vite: {
		resolve: {
			alias: {
				'@devprotocol/clubs-plugin-passports': fileURLToPath(
					new URL('../../src', import.meta.url),
				),
			},
		},
	},
})
