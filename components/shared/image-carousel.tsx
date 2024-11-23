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
	images: string[]
	name: string
}
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL

export const ImageCarousel: React.FC<Props> = ({ className, images, name }) => {
	const isDefaultImage = images[0] ? false : true
	const plugin = React.useRef(
		Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }),
	)
	return (
		<div className={cn('pl-2', className)}>
			<Carousel
				plugins={[plugin.current]}
				opts={{
					align: 'start',
					loop: true,
				}}
				className='h-full'
			>
				<CarouselContent className='h-full'>
					{isDefaultImage ? (
						<Image
							src={'/logo_black.svg'}
							alt={name}
							quality={5}
							width={500}
							height={500}
							className='object-contain opacity-30'
						/>
					) : (
						images.map((image, index) => (
							<CarouselItem
								key={index}
								className='relative min-h-[300px] min-w-full w-full flex justify-center items-center bg-background rounded-2xl'
							>
								<Image
									src={imageBaseUrl + image}
									alt={name}
									quality={5}
									fill
									sizes='(max-width: 100px) 100vw, (max-width: 200px) 50vw, 33vw'
									className='object-contain rounded-xl border-white border-[10px]'
								/>
							</CarouselItem>
						))
					)}
				</CarouselContent>
				{!isDefaultImage && (
					<>
						<CarouselPrevious className='absolute -left-4 text-foreground hover:bg-primary bg-background' />
						<CarouselNext className='absolute -right-4 text-foreground hover:bg-primary bg-background' />
					</>
				)}
			</Carousel>
		</div>
	)
}
