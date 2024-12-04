'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'react-use'
import { TypesCheckboxGroup } from './types-checkbox-group'
import { PriceSlider } from './price-slider'

interface Props {
	className?: string
	itemTypes: string[]
}

export const CatalogFilters: React.FC<Props> = ({ className, itemTypes }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Локальное состояние для диапазона цен
	const [priceRange, setPriceRange] = React.useState<number[]>([
		Number(searchParams.get('priceFrom') || 0),
		Number(searchParams.get('priceTo') || 20000),
	])
	const [activeTypes, setActiveTypes] = React.useState<string[]>([])

	// Дебаунс значения диапазона цен
	useDebounce(
		() => {
			const params = new URLSearchParams(searchParams.toString())
			params.set('priceFrom', priceRange[0].toString())
			params.set('priceTo', priceRange[1].toString())
			params.set('types', activeTypes.join(','))
			router.push(`?${params.toString()}`)
		},
		500,
		[priceRange, activeTypes],
	)

	// Обновление состояния при изменении диапазона цен
	const handlePriceChange = (values: number[]) => {
		setPriceRange(values)
	}
	const handleTypesChange = (types: string[]) => {
		setActiveTypes(types) // Обновляем состояние с выбранными типами
	}

	return (
		<div className={cn('min-w-[300px] m-2', className)}>
			<div className='flex flex-col gap-4 h-[400px] w-full bg-background rounded-xl shadow-md p-4'>
				<TypesCheckboxGroup
					selectedTypes={activeTypes}
					itemTypes={itemTypes}
					onTypesChange={handleTypesChange}
				/>
				<PriceSlider
					priceRange={priceRange}
					onPriceChange={handlePriceChange}
				/>
			</div>
		</div>
	)
}
