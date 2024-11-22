// Тип для Item
export interface Item {
	id: string
	name: string
	description?: string
	vendorCode?: string
	brand?: string
	images: string[]
	season?: string
	materials?: string
	materialLiner?: string
	materialInsulation?: string
	color?: string
	composition?: string
	heights?: string
	categoryId?: string
}

// Тип для Offer
export interface Offer {
	id: string
	name: string
	itemId: string
	warehouse: Record<string, number> // Ожидается JSON-объект с ключами как идентификаторами складов
	price: Record<string, number> // Ожидается JSON-объект с ключами как типами цен
}

// @types.ts
export interface CartItem {
	id: int // ID элемента корзины
	cartId: int // ID корзины
	offerId: string
	itemId: string
	quantity: number
}

export interface CartState {
	items: CartItem[]
	loading: boolean
	initializeCart: (userId: number) => Promise<void>
	addCartItem: (cartItem: CartItem) => Promise<void>
	removeCartItem: (offerId: string) => Promise<void>
	updateCartItemQuantity: (offerId: string, quantity: number) => Promise<void>
	syncCart: () => Promise<void>
}

interface OfferWithTypedJson extends Offer {
	price: PriceItem[] // price теперь строго массив объектов с name и value
	warehouse: WarehouseItem[] // warehouse также типизирован
}
