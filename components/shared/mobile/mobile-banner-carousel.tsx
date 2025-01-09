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
import Link from 'next/link'

interface Props {
	className?: string
}

export const MobileBannerCarousel: React.FC<Props> = ({ className }) => {
	const plugin = React.useRef(
		Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }),
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
				<CarouselContent className='rounded-3xl'>
					<CarouselItem key={2}>
						<Link href={'/catalog?query=Ботинки%20мужские%2013%20ПУ'}>
							<Image
								className='rounded-3xl'
								src='/images/banners/banner1.png'
								alt='banner'
								quality={5}
								width={1300}
								height={287}
							/>
						</Link>
					</CarouselItem>
					<CarouselItem key={3}>
						<Link href={'/catalog?query=вест-ворк'}>
							<Image
								className='rounded-3xl'
								src='/images/banners/banner2.png'
								alt='banner'
								quality={5}
								width={1300}
								height={287}
							/>
						</Link>
					</CarouselItem>
				</CarouselContent>
			</Carousel>
		</div>
	)
}
