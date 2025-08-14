import { encode } from '@devprotocol/clubs-core'

export default () =>
	encode({
		name: 'Debug',
		twitterHandle: '@debug',
		description: '',
		url: 'http://localhost:4321',
		propertyAddress: '',
		chainId: 137,
		rpcUrl: 'https://polygon-rpc.com/',
		adminRolePoints: 50,
		offerings: [
			{
				id: 'xxxxxxxxx',
				name: 'xxxxxxxxx',
				description: 'xxxxxxxxx',
				imageSrc: 'https://picsum.photos/600',
				payload: new Uint8Array([235, 38, 15, 156, 87, 195, 242, 73]),
				managedBy: 'xxxxxxxxx',
				i18n: {
					name: {
						en: 'FooBar',
						ja: 'ほげほげ',
					},
					description: {
						en: 'AAA',
						ja: 'あああ',
					},
				},
				previewImageSrc: 'https://picsum.photos/600',
			},
		],
		plugins: [
			{
				id: 'example-theme',
				options: [],
			},
			{
				id: 'unique-and-descriptive-name-here',
				options: [
					{ key: 'slug', value: 'stokens' },
					{ key: 'rpc', value: 'https://polygon-rpc.com/' },
					{ key: 'maxpage', value: 30 },
				],
			},
			{
				id: 'devprotocol:clubs:plugin:clubs-payments',
				options: [],
			},
		],
	})
