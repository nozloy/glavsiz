'use server'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams

		// Извлекаем параметры
		const offerIds = searchParams.get('offerids') || ''

		// Формируем запрос к базе
		const products = await prisma.offer.findMany({
			where: {
				id: {
					in: offerIds.split(',').filter(Boolean),
				},
			},
			include: { Item: true },
		})

		return NextResponse.json(products)
	} catch (error) {
		console.error('API: Ошибка получения товаров:', error)
		return NextResponse.json(
			{ error: 'API: Ошибка получения товаров' },
			{ status: 500 },
		)
	}
}
