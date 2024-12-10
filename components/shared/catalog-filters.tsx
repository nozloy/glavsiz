'use client'

import { useState } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'react-use'
import { TypesCheckboxGroup } from './types-checkbox-group'
import { PriceSlider } from './price-slider'
import { Minus, Plus } from 'lucide-react'

interface Props {
	className?: string
	itemTypes: string[]
}

export const CatalogFilters: React.FC<Props> = ({ className, itemTypes }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Локальное состояние для отображения всех типов
	const [showAll, setShowAll] = useState(false)

	// Локальное состояние для диапазона цен
	const [priceRange, setPriceRange] = useState<number[]>([
		Number(searchParams.get('priceFrom') || 0),
		Number(searchParams.get('priceTo') || 20000),
	])
	const [activeTypes, setActiveTypes] = useState<string[]>([])
	const displayedTypes = showAll ? itemTypes : itemTypes.slice(0, 8)
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
			<div className='flex flex-col gap-4 min-h-[400px] w-full max-w-[300px] bg-background rounded-xl shadow-md p-4'>
				<div>
					<TypesCheckboxGroup
						selectedTypes={activeTypes}
						itemTypes={displayedTypes}
						onTypesChange={handleTypesChange}
					/>
					<div className=' pl-1 text-primary-foreground'>
						{itemTypes.length > 8 && (
							<button onClick={() => setShowAll(!showAll)}>
								{showAll ? (
									<div className='flex flex-row items-center'>
										<Minus size={16} />
										Скрыть
									</div>
								) : (
									<div className='flex flex-row items-center'>
										<Plus size={16} />
										Еще
									</div>
								)}
							</button>
						)}
					</div>
				</div>

				<PriceSlider
					priceRange={priceRange}
					onPriceChange={handlePriceChange}
				/>
			</div>
		</div>
	)
}
