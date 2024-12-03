import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
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
		console.error('Error fetching items:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
