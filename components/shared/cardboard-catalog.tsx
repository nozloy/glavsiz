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
	sortBy: string
}

export const CardboardCatalog: React.FC<Props> = ({
	items,
	className,
	minPrice,
	maxPrice,
	sortBy,
}) => {
	const activeCity = useCityStore(state => state.activeCity)

	// Клиентская фильтрация
	const pricedItems = items.filter(item =>
		item.Offer.some(offer =>
			offer.price.some(
				price =>
					price.name === activeCity &&
					Number(price.value) >= minPrice &&
					Number(price.value) <= maxPrice,
			),
		),
	)
	const filteredItems =
		sortBy === 'priceDown'
			? [...pricedItems].sort((a, b) => {
					const aPrice = Math.max(
						...a.Offer.flatMap(offer =>
							offer.price
								.filter(price => price.name === activeCity)
								.map(price => Number(price.value)),
						),
					)
					const bPrice = Math.max(
						...b.Offer.flatMap(offer =>
							offer.price
								.filter(price => price.name === activeCity)
								.map(price => Number(price.value)),
						),
					)
					return bPrice - aPrice // По убыванию
			  })
			: sortBy === 'priceUp'
			? [...pricedItems].sort((a, b) => {
					const aPrice = Math.min(
						...a.Offer.flatMap(offer =>
							offer.price
								.filter(price => price.name === activeCity)
								.map(price => Number(price.value)),
						),
					)
					const bPrice = Math.min(
						...b.Offer.flatMap(offer =>
							offer.price
								.filter(price => price.name === activeCity)
								.map(price => Number(price.value)),
						),
					)
					return aPrice - bPrice // По возрастанию
			  })
			: pricedItems // Без сортировки, если sortBy не задан

	return (
		<div className={cn('grid grid-cols-3', className)}>
			{filteredItems.map((item, index) => (
				<ItemCard key={index} className='m-2' item={item} />
			))}
		</div>
	)
}
