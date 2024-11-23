'use client'
import React from 'react'
import { Item, Category } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Title } from './title'
import { ItemCard } from './item-card'
import { useNewItems } from '@/hooks/use-new-items'
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
				{items?.slice(0, 4).map(item => (
					<ItemCard key={item.id} item={item} />
				))}
			</div>
		</div>
	)
}
