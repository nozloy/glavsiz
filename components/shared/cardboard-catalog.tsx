'use client'

import { cn } from '@/lib/utils'
import { ItemCard } from './item-card'
import { ItemWithOffer, PriceFromDB } from '@/@types'
import { useCityStore } from '@/store/city-store'

interface Props {
	items: ItemWithOffer[]
	className?: string
	minPrice: number
	maxPrice: number
}

export const CardboardCatalog: React.FC<Props> = ({
	items,
	className,
	minPrice,
	maxPrice,
}) => {
	const activeCity = useCityStore(state => state.activeCity)

	// Клиентская фильтрация
	const filteredItems = items.filter(item =>
		item.Offer.some(offer =>
			offer.price.some(
				price =>
					price.name === activeCity &&
					Number(price.value) >= minPrice &&
					Number(price.value) <= maxPrice,
			),
		),
	)

	return (
		<div className={cn('grid grid-cols-3', className)}>
			{filteredItems.map((item, index) => (
				<ItemCard key={index} className='m-2' item={item} />
			))}
		</div>
	)
}
