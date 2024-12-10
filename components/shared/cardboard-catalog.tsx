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

	//Фильтруем товары только для с ценами по текущему городу
	const cityItems = items.filter(item =>
		item.Offer.some(offer =>
			offer.price.some(
				price => price.name === activeCity && Number(price.value) > 0,
			),
		),
	)

	// Фильтруем по заданному диапазоу цен
	const pricedItems = cityItems.filter(item =>
		item.Offer.some(offer =>
			offer.price.some(
				price =>
					price.name === activeCity &&
					Number(price.value) >= minPrice &&
					Number(price.value) <= maxPrice,
			),
		),
	)

	// Сортируем по возрастанию цены
	const sortedByPriceUp = [...pricedItems].sort((a, b) => {
		const aPrice = Math.min(
			...a.Offer.flatMap(offer =>
				offer.price
					.filter(price => price.name === activeCity && Number(price.value) > 0)
					.map(price => Number(price.value)),
			),
		)
		const bPrice = Math.min(
			...b.Offer.flatMap(offer =>
				offer.price
					.filter(price => price.name === activeCity && Number(price.value) > 0)
					.map(price => Number(price.value)),
			),
		)
		return aPrice - bPrice // По возрастанию
	})

	// Определяем итоговый список с учетом сортировки
	const filteredItems =
		sortBy === 'priceUp'
			? sortedByPriceUp
			: sortBy === 'priceDown'
			? [...sortedByPriceUp].reverse() // Реверсируем список
			: pricedItems // Без сортировки, если sortBy не задан

	return (
		<div className={cn('grid grid-cols-3', className)}>
			{filteredItems.map((item, index) => (
				<ItemCard key={index} className='m-2' item={item} />
			))}
		</div>
	)
}
