import { describe, it, expect } from 'vitest'
import plugin, { getPagePaths, getApiPaths, getAdminPaths, meta } from './index'

describe('Plugin default export', () => {
	it('should have getPagePaths, getApiPaths, getAdminPaths and meta', async () => {
		expect(plugin).toEqual({
			getPagePaths,
			getAdminPaths,
			meta,
			getApiPaths
		})
	})
})

describe('getPagePaths', () => {
	it('should return empty array if options are not set', async () => {
		const res = await getPagePaths([])
		expect(res).toEqual([])
	})
})
