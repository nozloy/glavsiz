import { prisma } from '@/prisma/prisma-client'
import { Offer, Item } from '@prisma/client'

// Тип для Item
// export interface Item {
// 	id: string
// 	name: string
// 	description?: string
// 	vendorCode?: string
// 	brand?: string
// 	images: string[]
// 	season?: string
// 	materials?: string
// 	materialLiner?: string
// 	materialInsulation?: string
// 	color?: string
// 	composition?: string
// 	heights?: string
// 	categoryId?: string
// }

// @types.ts
export interface CartItem {
	offerId: string
	Offer: OfferWithTypedJson
	quantity: number
}

export interface responseData {
	cartId: number
	cartItems: CartItem[]
}
export interface CartState {
	cartItems: CartItem[]
	cartLoading: boolean
	totalAmount: number
	totalPrice: number
	emptyCart: () => void
	syncCart: () => Promise<void>
	addCartItem: (offer: Offer) => Promise<void>
	removeCartItem: (offer: Offer) => Promise<void>
	updateCartItemQuantity: (offer: Offer, quantity: number) => Promise<void>
}

interface OfferWithTypedJson extends Offer {
	price: PriceItem[] // price теперь строго массив объектов с name и value
	warehouse: WarehouseItem[] // warehouse также типизирован
	Item: Item // item теперь строго объект типа Item
}
