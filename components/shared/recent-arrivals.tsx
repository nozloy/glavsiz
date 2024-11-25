'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Title } from './title'
import { ItemCard } from './item-card'
import { useNewItems } from '@/hooks/use-new-items'
import { ItemSceleton } from './item-sceleton'
interface Props {
	className?: string
}

export const RecentArrivals: React.FC<Props> = ({ className }) => {
	const { items, loading, error } = useNewItems(4)

	return (
		<div
			className={cn(
				'flex flex-col gap-4 items-start justify-start w-full',
				className,
			)}
		>
			<Title
				size='xl'
				text={'Новые поступления'}
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
