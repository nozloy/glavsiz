/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ir-2.ozone.ru',
			},
			{
				protocol: 'https',
				hostname: 'ufa.glavsiz.ru',
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
}

export default nextConfig
