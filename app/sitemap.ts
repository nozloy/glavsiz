import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

// Устанавливаем revalidate для кеширования данных sitemap
export const revalidate = process.env.REVALIDATE_TIME // обновление карты сайта (в секундах)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

	let items = []

	// Получаем секретный API ключ
	const apiSecretKey = process.env.API_SECRET_KEY

	// Выполняем запрос к API, передавая ключ
	try {
		// Получаем данные из API
		const response = await fetch(`${baseUrl}/api/items/sitemap`, {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiSecretKey || '', // Добавляем API ключ в заголовки запроса
			},
		})

		if (!response.ok) {
			throw new Error(`Ошибка sitemap api: ${response.statusText}`)
		}

		items = await response.json()
	} catch (error) {
		console.error('Ошибка получения данных для sitemap:', error)
	}

	const staticPages = [
		{ url: `${baseUrl}/`, lastModified: new Date().toISOString() },
		{ url: `${baseUrl}/catalog`, lastModified: new Date().toISOString() },
	]

	const dynamicPages = items.map((item: { id: string; createdAt: string }) => ({
		url: `${baseUrl}/item/${item.id}`,
		lastModified: item.createdAt,
	}))

	// Возвращаем скомпилированную карту сайта
	return [...staticPages, ...dynamicPages]
}
