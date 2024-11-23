import { Item, Offer } from '@prisma/client'
export interface OfferWithPrice extends Offer {
	price: PriceItem[]
}

export interface ItemWithOffer extends Item {
	Offer: OfferWithPrice[]
}