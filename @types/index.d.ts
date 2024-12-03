import { Category, Item, Offer } from '@prisma/client'
export interface OfferWithPrice extends Offer {
	price: PriceItem[]
}

export interface ItemWithOffer extends Item {
	Offer: OfferWithPrice[]
	category: Category
}
export interface ItemWithOfferOnly extends Item {
	Offer: Offer[]
}
export type PriceFromDB = {
	name: string
	value: number
}
