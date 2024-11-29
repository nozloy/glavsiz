import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXTAUTH_URL

	if (process.env.NODE_ENV !== 'production') {
		// Полностью закрываем сайт в разработке
		return {
			rules: [{ userAgent: '*', disallow: '/' }],
			sitemap: `${baseUrl}/sitemap.xml`,
		}
	}

	// Настройка для продакшена
	return {
		rules: [
			{ userAgent: '*', allow: '/' },
			{
				userAgent: '*',
				disallow: [
					'/api/',
					'/dashboard',
					'/static/',
					'/next/',
					'/_next/',
					'/404',
					'/500',
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	}
}
