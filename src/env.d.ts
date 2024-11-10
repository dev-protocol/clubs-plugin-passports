 
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly REDIS_URL: string
	readonly REDIS_USERNAME: string
	readonly REDIS_PASSWORD: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare module '*.astro' {
	import type { AstroComponentFactory } from 'astro/dist/runtime/server'
	export default InstanceType<AstroComponentFactory>
}
