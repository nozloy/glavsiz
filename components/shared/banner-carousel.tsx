'use client'
import React from 'react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Props {
	className?: string
}

export const BannerCarousel: React.FC<Props> = ({ className }) => {
	const plugin = React.useRef(
		Autoplay({ delay: 5000, stopOnInteraction: true }),
	)
	return (
		<div className={cn('pt-4', className)}>
			<Carousel
				plugins={[plugin.current]}
				opts={{
					align: 'start',
					loop: true,
				}}
			>
				<CarouselContent>
					<CarouselItem key={1}>
						<Image
							className='rounded-3xl'
							src='/images/banners/banner1.png'
							alt='banner'
							width={1300}
							height={250}
						/>
					</CarouselItem>
					<CarouselItem key={2}>
						<Image
							className='rounded-3xl'
							src='/images/banners/banner2.png'
							alt='banner'
							width={1300}
							height={250}
						/>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious className='absolute -left-4 text-foreground bg-primary' />
				<CarouselNext className='absolute -right-4 text-foreground bg-primary' />
			</Carousel>
		</div>
	)
}
