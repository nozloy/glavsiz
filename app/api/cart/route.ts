import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/constants/auth'

// Функция для получения сессии
async function getSessionOrUnauthorized() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.id) {
		throw new Error('Не авторизован')
	}
	return session
}

// Функция для получения или создания корзины
async function getOrCreateCart(userId: number) {
	let cart = await prisma.cart.findUnique({
		where: { userId },
		include: { CartItem: true },
	})

	if (!cart) {
		cart = await prisma.cart.create({
			data: { userId },
			include: { CartItem: true },
		})
	}

	return cart
}

// GET запрос - Получение корзины
export async function GET() {
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию

		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину

		return NextResponse.json({ cartId: cart.id, items: cart.CartItem || [] })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'Error fetching cart' },
				{ status: error.message ? 401 : 500 },
			)
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
	}
}

// POST запрос - Добавление товара в корзину
export async function POST(req: NextRequest) {
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию

		const { offerId, itemId, quantity } = await req.json()

		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину

		const cartItem = await prisma.cartItem.create({
			data: { cartId: cart.id, offerId, itemId, quantity },
		})

		return NextResponse.json(cartItem, { status: 201 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'Ошибка добавления товара в корзину' },
				{ status: 500 },
			)
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
	}
}
