import { PriceInfo } from '@/exchange/@types'
import { OfferWithTypedJson } from '@/store/@types'

export function getPrice(
	offers: OfferWithTypedJson[],
	offerId: string,
	activeCity: string,
) {
	const offer: OfferWithTypedJson | undefined = offers.find(
		offer => offer.id === offerId,
	)
	const price = offer?.price?.find((item: PriceInfo) =>
		item.name.includes(activeCity),
	)?.value
		? offer.price.find((item: PriceInfo) => item.name.includes(activeCity))
				?.value
		: null
	return price
}
