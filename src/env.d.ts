// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />

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

declare module '*.vue'
