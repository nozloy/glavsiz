'use server'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams

	// Извлекаем параметры и преобразуем их в числа
	const count = parseInt(searchParams.get('count') || '100', 10)
	const query = searchParams.get('query') || ''
	const categoryId = searchParams.get('categoryId') || ''

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
		},
		include: {
			Offer: true,
			category: true,
		},
		take: count,
	})

	return NextResponse.json(products)
}
