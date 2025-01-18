import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'
import { validateApiKey } from '@/lib/api'

export async function GET(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
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
