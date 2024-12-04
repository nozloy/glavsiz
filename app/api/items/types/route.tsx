import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'

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
		// Запрашиваем уникальные значения itemType
		const itemTypes = await prisma.item.findMany({
			distinct: ['itemType'],
			select: {
				itemType: true,
			},
		})

		// Возвращаем результат, исключая null
		return NextResponse.json(
			itemTypes
				.filter(item => item.itemType !== null) // Убираем элементы с null
				.map(item => item.itemType), // Преобразуем в массив значений
		)
	} catch (error) {
		console.error('Ошибка получения itemTypes:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
