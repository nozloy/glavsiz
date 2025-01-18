import { Category, Item, Offer, ParentCategory } from '@prisma/client'
export interface OfferWithPrice extends Offer {
	price: PriceItem[]
}
export interface CategoryWithParent extends Category {
	parentCategory: ParentCategory
}

export interface ItemWithOffer extends Item {
	Offer: OfferWithPrice[]
	category: CategoryWithParent
}
export interface ItemWithOfferOnly extends Item {
	Offer: OfferWithPrice[]
}

export type PriceFromDB = {
	name: string
	value: number
}
