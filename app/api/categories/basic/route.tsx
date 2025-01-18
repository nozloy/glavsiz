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
