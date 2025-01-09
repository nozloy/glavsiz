'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useBestItems } from '@/hooks/use-best-items'
import { MobileItemCard } from './mobile-item-card'
import { ItemSceleton } from '../item-sceleton'
import { Label } from '@/components/ui/label'

interface Props {
	className?: string
}

export const MobileBestSellers: React.FC<Props> = ({ className }) => {
	const { items, loading, error } = useBestItems()
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<Label className='px-2 text-xl font-bold'>Лидеры продаж</Label>
			<div className='flex flex-row gap-2 h-[370px] justify-left overflow-x-scroll overflow-hidden invisible-scrollbar px-2'>
				{loading
					? Array.from({ length: 4 }).map((_, index) => (
							<ItemSceleton key={index} isMobile={true} />
					  ))
					: items.map(item => <MobileItemCard key={item.id} item={item} />)}
			</div>
		</div>
	)
}
