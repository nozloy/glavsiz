/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.glavsiz.ru',
			},
			{
				protocol: 'https',
				hostname: 'avatars.yandex.net',
			},
			{
				protocol: 'https',
				hostname: '*.userapi.com',
			},
		],
	},
	//Все изображения, обработанные через Next.js (/_next/image), будут иметь заголовок Cache-Control с долгосрочным кэшированием.
	async headers() {
		return [
			{
				source: '/_next/image(.*)', // Для изображений, оптимизированных Next.js
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

export default nextConfig
