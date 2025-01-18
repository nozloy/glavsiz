'use server'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams

		// Извлекаем параметры и преобразуем их в числа
		const count = Math.max(parseInt(searchParams.get('count') || '100', 10), 1) // Убедимся, что count всегда больше 0
		const query = searchParams.get('query') || ''
		const categoryId = searchParams.get('categoryId') || ''
		const itemTypes = searchParams.get('types') || ''
		const offerIds = searchParams.get('offerids') || ''

		// Формируем запрос к базе
		const products = await prisma.item.findMany({
			distinct: ['vendorCode'],
			where: {
				Offer: {
					some:
						offerIds != ''
							? {
									id: {
										in: offerIds.split(',').filter(Boolean),
									},
							  }
							: {},
				},
				...(query && {
					OR: [
						{
							name: {
								contains: query,
								mode: 'insensitive',
							},
						},
						{
							vendorCode: {
								contains: query,
								mode: 'insensitive',
							},
						},
					],
				}),
				...(categoryId && {
					OR: [
						// Проверяем товары с указанной категорией
						{ categoryId: categoryId },
						// Проверяем товары из категорий, связанных с указанной родительской категорией
						{
							category: {
								parentCategoryId: categoryId,
							},
						},
					],
				}),
				...(itemTypes && {
					itemType: {
						in: itemTypes.split(',').filter(Boolean),
					},
				}),
			},
			include: {
				Offer: true,
				category: {
					include: {
						parentCategory: true,
					},
				},
			},

			take: count,
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
