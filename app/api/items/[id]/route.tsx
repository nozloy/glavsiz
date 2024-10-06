// app/api/items/[id]/route.tsx
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { id } = params

	if (!id) {
		return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
	}

	try {
		const item = await prisma.item.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				variants: {
					include: {},
				},
			},
		})

		if (!item) {
			return NextResponse.json({ error: 'Item not found' }, { status: 404 })
		}

		return NextResponse.json(item)
	} catch (error) {
		console.error('Error fetching item:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
