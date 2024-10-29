'use server'
import { prisma } from '@/prisma/prisma-client'

// Получение товаров в корзине для пользователя
export const getCartItems = async (userId: number) => {
	const cartItems = await prisma.cartItem.findMany({
		where: { cart: { userId } },
		include: { item: true },
	})
	return cartItems
}
export const getItem = async (id: number) => {
	const item = await prisma.item.findUnique({ where: { id } })
	return item
}
// Добавление товара в корзину
export const addItemToCart = async (userId: number, itemId: number) => {
	const cart = await prisma.cart.upsert({
		where: { userId },
		update: {},
		create: { userId },
	})

	const existingCartItem = await prisma.cartItem.findFirst({
		where: { cartId: cart.id, itemId },
	})

	if (existingCartItem) {
		return await prisma.cartItem.update({
			where: { id: existingCartItem.id },
			data: { quantity: existingCartItem.quantity + 1 },
		})
	} else {
		return await prisma.cartItem.create({
			data: {
				cartId: cart.id,
				itemId,
			},
		})
	}
}

// Обновление количества товара в корзине
export const updateItemQuantity = async (
	userId: number,
	itemId: number,
	quantity: number,
) => {
	const cart = await prisma.cart.findUnique({ where: { userId } })
	if (!cart) return null

	return await prisma.cartItem.updateMany({
		where: { cartId: cart.id, itemId },
		data: { quantity },
	})
}

// Удаление товара из корзины
export const removeItemFromCart = async (userId: number, itemId: number) => {
	const cart = await prisma.cart.findUnique({ where: { userId } })
	if (!cart) return null

	return await prisma.cartItem.deleteMany({
		where: { cartId: cart.id, itemId },
	})
}
export const deleteCart = async (userId: number) => {
	const cart = await prisma.cart.findUnique({ where: { userId } })
	console.log('user:', userId, 'cart:', cart?.id)
	if (!cart) return null

	// Удалить связанные записи в CartItem перед удалением корзины
	await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

	// Удалить саму корзину
	return await prisma.cart.delete({ where: { id: cart.id } })
}
