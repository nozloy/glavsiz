import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/constants/auth'
import { Offer } from '@prisma/client'
import { validateApiKey } from '@/lib/api'

// Настройка CORS
export async function OPTIONS() {
	const headers = new Headers()
	headers.set('Access-Control-Allow-Origin', 'https://nozloy.ru')
	headers.set('Access-Control-Allow-Credentials', 'true')
	headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
	headers.set(
		'Access-Control-Allow-Headers',
		'Origin, Accept, X-Requested-With, Content-Type',
	)

	return new NextResponse(null, { headers })
}

// Функция для получения сессии
async function getSessionOrUnauthorized() {
	const session = await getServerSession(authOptions)
	if (!session) {
		throw new Error('Ошибка получения серверной сессии')
	}
	if (!session?.user?.id) {
		throw new Error('Не авторизован')
	}
	return session
}

// Функция для получения или создания корзины
async function getOrCreateCart(userId: number) {
	let cart = await prisma.cart.upsert({
		where: { userId },
		update: {},
		create: { userId },
		include: { CartItem: { include: { Offer: { include: { Item: true } } } } },
	})

	return cart
}

// GET запрос - Получение корзины
export async function GET(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию
		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину
		return NextResponse.json({
			cartId: cart.id,
			cartItems: cart.CartItem || [],
		})
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'API: Ошибка получения корзины' },
				{ status: error.message ? 401 : 500 },
			)
		}
		return NextResponse.json({ error: 'API: Unknown error' }, { status: 500 })
	}
}

// POST запрос - Добавление товара в корзину
export async function POST(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию
		const offer: Offer = await req.json() // Получаем данные товара
		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину
		await prisma.cartItem.upsert({
			where: {
				offerId: offer.id,
				cartId: cart.id,
			},
			update: {
				quantity: {
					increment: 1,
				},
			},
			create: {
				cartId: cart.id,
				offerId: offer.id,
			},
		})

		return NextResponse.json(
			{ message: 'API: Товар добавлен в корзину' },
			{ status: 201 },
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'API: Ошибка добавления товара в корзину' },
				{ status: 500 },
			)
		}
		return NextResponse.json({ error: 'API: Unknown error' }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию
		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину
		const { offer, quantity }: { offer: Offer; quantity: number } =
			await req.json() // Получаем данные товара
		await prisma.cartItem.upsert({
			where: {
				offerId: offer.id,
				cartId: cart.id,
			},
			update: {
				quantity: {
					increment: quantity,
				},
			},
			create: {
				cartId: cart.id,
				offerId: offer.id,
			},
		})

		return NextResponse.json(
			{ message: 'API: Корзина обновлена' },
			{ status: 200 },
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'API: Ошибка обновления корзины' },
				{ status: 500 },
			)
		}
		return NextResponse.json({ error: 'API: Unknown error' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
	// Проверка API-ключа
	if (!validateApiKey(req)) {
		return NextResponse.json({ error: 'Неверный API ключ' }, { status: 403 })
	}
	try {
		const session = await getSessionOrUnauthorized() // Получаем сессию
		const offer: Offer = await req.json() // Получаем данные товара
		const cart = await getOrCreateCart(Number(session.user.id)) // Получаем или создаем корзину

		await prisma.cartItem.delete({
			where: {
				offerId: offer.id,
				cartId: cart.id,
			},
		})

		return NextResponse.json(
			{ message: 'API: Товар удален из корзины' },
			{ status: 200 },
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || 'API: Ошибка добавления товара в корзину' },
				{ status: 500 },
			)
		}
		return NextResponse.json({ error: 'API: Unknown error' }, { status: 500 })
	}
}
