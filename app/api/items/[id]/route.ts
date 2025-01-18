import { validateApiKey } from '@/lib/api'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

// Функция для обработки GET запроса
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}

	try {
		// Запрашиваем данные из базы
		const item = await prisma.item.findUnique({
			where: { id: params.id },
			include: { Offer: true, category: true }, // Включаем связанные Offer
		})

		if (!item) {
			// Если элемент не найден
			return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
		}

		// Формируем ответ с кэшированием
		const response = NextResponse.json(item)
		response.headers.set(
			'Cache-Control',
			`s-maxage=${process.env.REVALIDATE_TIME || 60}, stale-while-revalidate`,
		)

		return response
	} catch (error) {
		console.error('Ошибка получения товара:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
