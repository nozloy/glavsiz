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
			{
				protocol: 'https',
				hostname: '54e5fb9cafb5-data.s3.ru1.storage.beget.cloud',
			},
		],
	},
	// Заголовки для изображений в папке public/images и ее подпапках, а также для всех .svg файлов в public/
	async headers() {
		return [
			// Для всех изображений в папке /public/images и ее подпапках
			{
				source: '/images/(.*)', // Для изображений в папке images
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=604800, immutable', // Кеширование на 7 дней
					},
				],
			},
			// Для всех .svg файлов в public/ и ее подпапках
			{
				source: '/(.*.svg)', // Для всех .svg файлов в public/
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=604800, immutable', // Кеширование на 7 дней
					},
				],
			},
			// Для изображений, обработанных Next.js
			{
				source: '/_next/image(.*)', // Для изображений, оптимизированных Next.js
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=604800, immutable',
					},
				],
			},
		]
	},
}

export default nextConfig
