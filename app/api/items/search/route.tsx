'use server'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const count = req.nextUrl.searchParams.get('count') || 100
	const query = req.nextUrl.searchParams.get('query') || ''
	const categoryId = req.nextUrl.searchParams.get('categoryId') || ''
	const products = await prisma.item.findMany({
		distinct: ['vendorCode'],
		where: {
			Offer: {
				some: {},
			},
			...(query && {
				name: {
					contains: query,
					mode: 'insensitive',
				},
			}),
			...(categoryId && {
				categoryId: categoryId,
			}),
		},
		include: {
			Offer: true,
		},
		take: Number(count),
	})

	return NextResponse.json(products)
}
