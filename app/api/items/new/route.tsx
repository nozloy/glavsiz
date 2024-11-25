import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	// Получаем параметр count и преобразуем его в число с безопасной обработкой
	const count = Number(req.nextUrl.searchParams.get('count')) || 1

	// Проверяем, что count — корректное число
	if (isNaN(count) || count <= 0) {
		return NextResponse.json(
			{ error: 'Неправильное значение количества' },
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

		// Возвращаем результат
		return NextResponse.json(items)
	} catch (error) {
		console.error('Error fetching items:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
