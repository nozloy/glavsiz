'use client'

import React, { useState } from 'react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import ModalImage from '@/components/shared/modal-image'
import { Card, CardContent } from '../../ui/card'

interface Props {
	className?: string
	images: string[]
	name: string
}
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL

export const MobileImageCarousel: React.FC<Props> = ({
	className,
	images,
	name,
}) => {
	const isDefaultImage = images[0] ? false : true
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeImage, setActiveImage] = useState<string | null>(
		images[0] || null,
	)
	const [isModalLoading, setIsModalLoading] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [isCarouselLoaded, setIsCarouselLoaded] = useState(false)

	const handleModalImageLoad = () => {
		setIsModalLoading(false)
	}
	const handleImageLoad = () => {
		setIsLoading(false)
		setIsCarouselLoaded(true)
	}

	const openModal = (image: string) => {
		setIsModalOpen(true)
		setActiveImage(image)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setIsModalLoading(true)
	}

	return (
		<div className={cn('w-full', className)}>
			{/* Основное изображение */}
			{isDefaultImage ? (
				<Image
					src={'/logo_black.svg'}
					alt={name}
					quality={5}
					width={250}
					height={250}
					className={cn(
						'object-contain relative bg-background rounded-xl mx-auto h-[250px]',
					)}
				/>
			) : (
				<div className='relative flex justify-center mb-2 w-full'>
					{/* Обернут в отдельный контейнер с relative */}
					<div
						className={cn('relative transition-all duration-300 w-full', {
							'opacity-0': !isCarouselLoaded,
							'opacity-100': isCarouselLoaded,
						})}
					>
						<Carousel
							opts={{
								align: 'start',
								loop: true,
							}}
						>
							<CarouselContent className='p-1 -ml-4 -mr-4'>
								{images.map((image, index) => (
									<CarouselItem key={index}>
										<div>
											<Card className='shadow-sm transition-all duration-300 min-h-[330px] p-1 w-[250px] mx-auto'>
												<CardContent
													className='flex aspect-square items-center justify-center p-1'
													onClick={() => openModal(image)} // Открыть модальное окно
												>
													<Image
														src={imageBaseUrl + image}
														alt={name}
														width={250}
														height={250}
														quality={40}
														className=' rounded-xl'
														onLoad={() => handleImageLoad()}
													/>
												</CardContent>
											</Card>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							{!isDefaultImage && images.length > 1 && (
								<>
									<CarouselPrevious className='absolute -left-1 text-foreground hover:bg-primary bg-background' />
									<CarouselNext className='absolute -right-1 text-foreground hover:bg-primary bg-background' />
								</>
							)}
						</Carousel>
					</div>
				</div>
			)}

			{/* Модальное окно */}
			{isModalOpen && activeImage && (
				<ModalImage onClose={closeModal}>
					<div className='relative p-0 overflow-hidden flex justify-center items-center h-[70vh] w-[80vw] '>
						{isModalLoading && (
							<div className='absolute z-10 flex items-center justify-center bg-background bg-opacity-50 rounded-xl p-4 animate-pulse'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src='/logo_black.svg'
									alt={name}
									width={384}
									height={384}
								/>
							</div>
						)}

						<Image
							src={imageBaseUrl + activeImage}
							alt={name}
							quality={100}
							fill
							className='object-contain'
							onLoad={() => handleModalImageLoad()}
						/>
					</div>
				</ModalImage>
			)}
		</div>
	)
}
