import React from 'react'
import { cn } from '@/lib/utils'
import { Title } from './title'
import { RangeSlider } from './range-slider'

interface Props {
	className?: string
	onPriceChange: (values: number[]) => void
	priceRange: number[]
}

export const PriceSlider: React.FC<Props> = ({
	className,
	onPriceChange,
	priceRange,
}) => {
	return (
		<div className={cn('', className)}>
			<Title
				size='sm'
				className='text-left text-muted-foreground'
				text={'Стоимость'}
			/>
			<div className='w-full py-4 pr-2'>
				<RangeSlider
					min={0}
					max={20000}
					step={1000}
					value={priceRange}
					onValueChange={onPriceChange}
				/>
			</div>
		</div>
	)
}
