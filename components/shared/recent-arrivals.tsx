import React from 'react'
import { Item, Category } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Title } from './title'
import { ItemCard } from './item-card'

interface Props {
	items: Item[]
	categories: Category[]
	className?: string
}

export const RecentArrivals: React.FC<Props> = ({
	items,
	categories,
	className,
}) => {
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
			<div className='flex flex-row gap-3 justify-start items-center'>
				{items?.slice(0, 5).map(item => (
					<ItemCard
						key={item.id}
						item={item}
						category={categories.filter(cat => cat.id === item.categoryId)[0]}
						images={item.images}
					/>
				))}
			</div>
		</div>
	)
}
