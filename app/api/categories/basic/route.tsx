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
		const categories = await prisma.category.findMany()

		// Формируем ответ с заголовками кэширования
		const response = NextResponse.json(categories)

		// Устанавливаем кэширование
		response.headers.set(
			'Cache-Control',
			`s-maxage=${process.env.REVALIDATE_TIME || 60}, stale-while-revalidate`,
		)

		// Возвращаем результат
		return response
	} catch (error) {
		console.error('Ошибка получения данных категорий:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
