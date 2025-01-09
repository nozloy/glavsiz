'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ItemWithOffer } from '@/@types'
import Link from 'next/link'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { useCityStore } from '@/store/city-store'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
	className?: string
	item: ItemWithOffer
	size?: 'sm' | 'md' | 'lg'
}

export const MobileItemCard: React.FC<Props> = ({ className, item, size }) => {
	const [isLoading, setIsLoading] = useState(true) // локальный state для загрузки изображения
	const isDefaultImage = item.images[0] ? false : true
	const { activeCity } = useCityStore()
	const offers = Array.isArray(item?.Offer) ? item.Offer : []

	const filteredPrices = offers.flatMap(offer =>
		Array.isArray(offer?.price)
			? offer.price.filter(priceItem => priceItem?.name.includes(activeCity))
			: [],
	)

	const activeCityPrice = filteredPrices.reduce((minPrice, currentPrice) => {
		const currentValue = parseFloat(currentPrice?.value) || Infinity
		const minValue = parseFloat(minPrice?.value) || Infinity

		if (currentValue < minValue) {
			return currentPrice
		}
		return minPrice
	}, null)?.value

	const price = activeCityPrice ? activeCityPrice : 0

	const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL
	return (
		<Link
			className={cn('relative', className)}
			href={'/item/' + item.id + '/'}
			target='_parent'
		>
			<Card
				className={cn(
					'group relative flex flex-col justify-end  shadow-md select-none transition-all duration-300 bg-card h-[360px] w-[230px]',
					size
						? size === 'sm'
							? 'h-[300px] w-[170px]'
							: 'h-[360px] w-[230px]'
						: 'h-[360px] w-[230px]',
				)}
			>
				<CardHeader className='pb-0 pt-4 px-2 *:text-center *:drop-shadow-sm'>
					<CardTitle className='min-h-2 line-clamp-2 text-sm font bold'>
						{item.name.charAt(0).toUpperCase() +
							item.name.slice(1).toLowerCase()}
					</CardTitle>
				</CardHeader>
				<CardContent className='p-0 mt-auto'>
					<div
						className={cn(
							'relative overflow-hidden rounded-2xl flex items-center justify-center w-full',
							size ? (size === 'sm' ? 'h-[200px]' : 'h-[250px]') : 'h-[250px]',
						)}
					>
						{/* Индикатор загрузки */}
						{isLoading && (
							<Skeleton className=' absolute inset-4 flex items-center justify-center '>
								<div className='spinner border-4 border-t-transparent border-primary rounded-full w-10 h-10 animate-spin' />
							</Skeleton>
						)}
						<Image
							src={
								!isDefaultImage
									? imageBaseUrl + item.images[0]
									: '/logo_black.svg'
							}
							alt={item.name}
							quality={35}
							sizes='(max-width: 375px) 35vw, (max-width: 675px) 45vw, 75vw'
							fill
							loading='lazy'
							className={cn('object-contain transition-opacity p-2', {
								'opacity-30': isDefaultImage,
								'opacity-0': isLoading,
								'opacity-100': !isLoading,
							})}
							onLoad={() => setIsLoading(false)} // Когда изображение загрузилось
						/>
					</div>
				</CardContent>
				<CardFooter className='w-full mt-auto flex flex-row justify-end items-end pb-4 px-4 pt-0'>
					<Badge
						variant={'default'}
						key={item.id + activeCity}
						className='text-accent-foreground text-md font-bold'
					>
						{price ? price + '₽' : '-'}
					</Badge>
				</CardFooter>
			</Card>
		</Link>
	)
}
