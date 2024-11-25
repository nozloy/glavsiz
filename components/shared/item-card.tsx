'use client'
import React from 'react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useCityStore } from '@/store/city-store'
import { ItemWithOffer } from '@/@types'

interface Props {
	className?: string
	item: ItemWithOffer
}
export const ItemCard: React.FC<Props> = ({ className, item }) => {
	const isDefaultImage = item.images[0] ? false : true
	const { activeCity } = useCityStore()
	const priceArray = Array.isArray(item?.Offer[0]?.price)
		? item.Offer[0].price
		: []
	const activeCityPrice = priceArray.find(priceItem =>
		priceItem?.name.includes(activeCity),
	)?.value
	const price = activeCityPrice ? activeCityPrice : priceArray[0]?.value
	return (
		<Link
			className={cn('relative h-[460px] w-[290px] ', className)}
			href={'/item/' + item.id + '/'}
			target='_parent'
		>
			<Card className='group relative flex flex-col justify-end h-full shadow-md hover:shadow-lg hover:scale-105 hover:shadow-primary/50 cursor-pointer select-none transition-all duration-300 bg-card'>
				<CardHeader className='pb-6 pt-6 *:text-right *:drop-shadow-sm *:group-hover:drop-shadow-md *:group-hover:drop-shadow-primary'>
					<CardTitle className='min-h-10 line-clamp-2'>
						{item.name.charAt(0).toUpperCase() +
							item.name.slice(1).toLowerCase()}
					</CardTitle>
				</CardHeader>
				<CardContent className='pt-0 pb-4 mt-auto'>
					<div
						className={`relative overflow-hidden rounded-2xl p-0 flex items-center justify-center h-[300px] w-full`}
					>
						<Image
							src={
								!isDefaultImage
									? 'https://cdn.glavsiz.ru/images/' + item.images[0]
									: '/logo_black.svg'
							}
							alt={item.name}
							quality={5}
							sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
							fill
							className={cn('object-contain', {
								'opacity-30': isDefaultImage,
							})}
						/>
						{/* тут должен быть стикер */}
						<div className='absolute inset-0 rounded-2xl'></div>
					</div>
				</CardContent>
				<CardFooter className='mt-auto flex flex-row justify-between pb-5'>
					<p
						key={item.id + activeCity}
						className=' text-accent-foreground pl-1 text-xl font-bold'
					>
						{price ? price + '₽' : '-'}
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
