'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Title } from './title'
import { RangeSlider } from './range-slider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'react-use'

interface Props {
	className?: string
}

export const CatalogFilters: React.FC<Props> = ({ className }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Локальное состояние для диапазона цен
	const [priceRange, setPriceRange] = React.useState<number[]>([
		Number(searchParams.get('priceFrom') || 0),
		Number(searchParams.get('priceTo') || 10000),
	])

	// Дебаунс изменения диапазона цен
	const debouncedPriceRange = useDebounce(
		() => {
			const params = new URLSearchParams(searchParams.toString())
			params.set('priceFrom', priceRange[0].toString())
			params.set('priceTo', priceRange[1].toString())
			router.push(`?${params.toString()}`)
		},
		1000,
		[priceRange],
	)

	// Обновление состояния при изменении диапазона цен
	const handlePriceChange = (values: number[]) => {
		setPriceRange(values)
	}

	return (
		<div className={cn('min-w-[300px] m-2', className)}>
			<div className='h-full w-full bg-background rounded-xl shadow-md p-4'>
				<Title
					size='md'
					className='text-center text-foreground'
					text={'Фильтры'}
				/>
				<Title
					size='sm'
					className='text-left text-muted-foreground'
					text={'Стоимость'}
				/>
				<div className='w-full py-4 pr-2'>
					<RangeSlider
						min={0}
						max={10000}
						step={10}
						value={priceRange}
						onValueChange={handlePriceChange}
					/>
				</div>
			</div>
		</div>
	)
}
