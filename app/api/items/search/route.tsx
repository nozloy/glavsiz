'use server'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams

	// Извлекаем параметры и преобразуем их в числа
	const count = Math.max(parseInt(searchParams.get('count') || '100', 10), 1) // Убедимся, что count всегда больше 0
	const query = searchParams.get('query') || ''
	const categoryId = searchParams.get('categoryId') || ''
	const itemTypes = searchParams.get('types') || ''
	const sortBy = searchParams.get('sortBy') || ''
	// Формируем запрос к базе
	const products = await prisma.item.findMany({
		distinct: ['vendorCode'],
		where: {
			Offer: {
				some: {},
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
				categoryId: categoryId,
			}),
			...(itemTypes && {
				itemType: {
					in: itemTypes.split(',').filter(Boolean),
				},
			}),
		},
		include: {
			Offer: true,
			category: true,
		},
		take: count,
	})

	return NextResponse.json(products)
}
