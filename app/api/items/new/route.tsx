import { validateApiKey } from '@/lib/api'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

// Функция для обработки GET запроса
export async function GET(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}

	// Получаем параметр count
	const countParam = req.nextUrl.searchParams.get('count')
	const count = Number(countParam)

	// Валидация параметра count
	if (!countParam || isNaN(count) || count <= 0) {
		return NextResponse.json(
			{ error: 'Параметр count должен быть положительным числом' },
			{ status: 400 },
		)
	}

	try {
		// Запрашиваем данные из базы
		const items = await prisma.item.findMany({
			distinct: ['vendorCode'],
			where: {
				Offer: {
					some: {}, // Проверяем наличие хотя бы одного связанного Offer
				},
				NOT: {
					images: {
						equals: null, // Исключаем записи, где images == null
					},
				},
			},
			orderBy: { createdAt: 'desc' }, // Сортируем по createdAt в порядке убывания
			take: count, // Ограничиваем количество записей
			include: { Offer: true }, // Включаем связанные Offer
		})

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
		console.error('Ошибка при получении данных:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
