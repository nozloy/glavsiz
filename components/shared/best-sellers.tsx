'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Title } from './title'
import { ItemCard } from './item-card'
import { useBestItems } from '@/hooks/use-best-items'
import { ItemSceleton } from './item-sceleton'
interface Props {
	className?: string
}

export const BestSellers: React.FC<Props> = ({ className }) => {
	const { items, loading, error } = useBestItems()

	return (
		<div
			className={cn(
				'flex flex-col gap-4 items-start justify-start w-full',
				className,
			)}
		>
			<Title
				size='xl'
				text={'Лидеры продаж'}
				className='text-left text-muted-foreground'
			/>
			<div className='w-full flex flex-row justify-between items-center'>
				{loading
					? Array.from({ length: 4 }).map((_, index) => (
							<ItemSceleton key={index} />
					  ))
					: error
					? error
					: items?.map(item => <ItemCard key={item.id} item={item} />)}
			</div>
		</div>
	)
}
