import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	// Получаем API-ключ из заголовков запроса
	const apiKey = req.headers.get('x-api-key')

	// Получаем секретный ключ из переменных окружения
	const expectedApiKey = process.env.API_SECRET_KEY

	// Проверяем валидность API-ключа
	if (!apiKey || apiKey !== expectedApiKey) {
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

		// Возвращаем результат
		return NextResponse.json(items)
	} catch (error) {
		console.error('Ошибка получения лучших товаров:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
