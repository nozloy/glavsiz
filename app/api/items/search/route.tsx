import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const query = req.nextUrl.searchParams.get('query') || ''

	const products = await prisma.item.findMany({
		distinct: ['vendorCode'],
		where: {
			name: {
				contains: query,
				mode: 'insensitive',
			},
		},
		take: 10,
	})

	return NextResponse.json(products)
}
