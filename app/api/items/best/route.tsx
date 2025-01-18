import { validateApiKey } from '@/lib/api'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}

	try {
		// Запрашиваем данные из базы
		const bestItems = await prisma.bestItem.findMany({
			include: {
				Item: {
					include: {
						Offer: true, // Включение связанных Offer
					},
				},
			},
		})

		// Преобразуем результат в массив Item[]
		const items = bestItems.map(bestItem => bestItem.Item)

		// Формируем ответ с заголовками кэширования
		const response = NextResponse.json(items)

		// Устанавливаем заголовки кэширования
		response.headers.set(
			'Cache-Control',
			`s-maxage=${process.env.REVALIDATE_TIME || 60}, stale-while-revalidate`,
		)

		// Возвращаем результат
		return response
	} catch (error) {
		console.error('Ошибка получения лучших товаров:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
