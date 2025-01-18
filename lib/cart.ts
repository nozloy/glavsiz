'use server'

import { cookies } from 'next/headers'
import { CartItem, OfferWithTypedJson, responseData } from '@/store/@types'
import { getPrice } from './get-price'
import apiClient from './axios'
import { Offer } from '@prisma/client'

// Функция для получения ID корзины

export const getOrCreateCart = async (userId: number) => {}
// Функция для получения общей стоимости товаров в корзине
export const getCartItemsTotalPrice = async (
	cartItems: CartItem[],
	activeCity: string,
): Promise<number> => {
	const encodedIds = cartItems
		.map(item => item.offerId)
		.map(encodeURIComponent)
		.join(',')
	const response = await apiClient.get(`/offer?offerids=${encodedIds}`)
	const offers: OfferWithTypedJson[] = response.data
	const totalPrice = offers.reduce(
		(total: number, offer: OfferWithTypedJson) => {
			const cartItem = cartItems.find(item => item.offerId === offer.id)
			return (
				total +
				(getPrice(offers, offer.id, activeCity) ?? 0) *
					(cartItem?.quantity ?? 0)
			)
		},
		0,
	)
	return totalPrice
}
// Функция для получения товаров в корзине
export const getCartItems = async () => {
	const cookieHeader = cookies()
	const response = await apiClient.get('/cart', {
		headers: {
			Cookie: cookieHeader.toString(), // Добавляем куки в заголовки, чтобы сервер по api принял куки
		},
	})
	const data: responseData = await response.data
	const cartItems = data.cartItems
	return cartItems
}

// Функция для добавления товара в корзину
export const postCartItem = async (offer: Offer) => {
	const cookieHeader = cookies()
	const response = await apiClient.post('/cart', JSON.stringify(offer), {
		headers: {
			Cookie: cookieHeader.toString(), // Добавляем куки в заголовки, чтобы сервер по api принял куки
		},
	})
	return response.status
}

// Функция для удаления товара из корзины
export const deleteCartItem = async (offer: Offer) => {
	const cookieHeader = cookies()
	const response = await apiClient.delete('/cart', {
		data: JSON.stringify(offer),
		headers: {
			Cookie: cookieHeader.toString(), // Добавляем куки в заголовки, чтобы сервер по api принял куки
		},
	})
	return response.status
}

// Функция для обновления количества товара в корзине
export const patchCartItem = async (offer: Offer, quantity: number) => {
	const cookieHeader = cookies()
	const response = await apiClient.patch(
		'/cart',
		JSON.stringify({ offer, quantity }),
		{
			headers: {
				Cookie: cookieHeader.toString(), // Добавляем куки в заголовки, чтобы сервер по api принял куки
			},
		},
	)
	return response.status
}

// Функция для очищения корзины
export const clearCart = async () => {
	const cookieHeader = cookies()
	const response = await apiClient.delete('/cart/empty', {
		headers: {
			Cookie: cookieHeader.toString(), // Добавляем куки в заголовки, чтобы сервер по api принял куки
		},
	})
	return response.status
}
