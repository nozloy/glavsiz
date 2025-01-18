import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/constants/auth'
import { validateApiKey } from '@/lib/api'

// Функция для получения сессии
async function getSessionOrUnauthorized() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.id) {
		throw new Error('Не авторизован')
	}
	return session
}

async function getOrCreateCart(userId: number) {
	let cart = await prisma.cart.upsert({
		where: { userId },
		update: {},
		create: { userId },
		include: { CartItem: { include: { Offer: { include: { Item: true } } } } },
	})

	return cart
}
export async function DELETE(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию
		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину

		await prisma.cartItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		})
		return NextResponse.json({ status: 201 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'API: Ошибка создания корзины' },
				{ status: 500 },
			)
		}
		return NextResponse.json({ error: 'API: Unknown error' }, { status: 500 })
	}
}
