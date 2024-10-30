import React, { lazy, useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Item, Category } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
	className?: string
	item: Item
	category: Category
	images: string[]
}

export const ItemCard: React.FC<Props> = ({
	className,
	item,
	category,
	images,
}) => {
	const isDefaultImage = images[0].includes('default')
	return (
		<Link
			className={cn('h-[440px] w-[255px]', className)}
			href={'/item/' + item.id + '/'}
			target='_parent'
		>
			<Card className='group relative flex flex-col justify-end h-full shadow-md hover:shadow-lg hover:scale-105 hover:shadow-primary/50 cursor-pointer select-none transition-all duration-300 bg-card'>
				<CardHeader className='pb-0 pt-6 *:text-right *:drop-shadow-sm *:group-hover:drop-shadow-md *:group-hover:drop-shadow-primary'>
					<CardTitle className='min-h-12 line-clamp-3'>
						{item.name.charAt(0).toUpperCase() +
							item.name.slice(1).toLowerCase()}
					</CardTitle>
				</CardHeader>
				<CardContent className='pt-0 pb-4 mt-auto'>
					<div
						className={`relative w-[205px] h-[275px] overflow-hidden rounded-2xl p-0 flex items-center justify-center`}
					>
						<Image
							src={!isDefaultImage ? images[0] : '/logo_black.svg'}
							alt={item.name}
							width={155}
							height={275}
							className={`${
								isDefaultImage ? 'object-contain opacity-30' : 'object-cover'
							}`}
						/>
						{/* тут должен быть стикер */}
						<div className='absolute inset-0 rounded-2xl'></div>
					</div>
				</CardContent>
				<CardFooter className='mt-auto flex flex-row justify-between pb-5'>
					<p className=' text-accent-foreground pl-1 text-xl font-bold'>
						{item.price} ₽
					</p>
					<Button
						variant={'default'}
						className='font-semibold text-md text-card-foreground'
					>
						подробнее
					</Button>
				</CardFooter>
			</Card>
		</Link>
	)
}
