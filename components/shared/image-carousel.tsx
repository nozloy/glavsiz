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
import { Card, CardContent } from '../ui/card'

interface Props {
	className?: string
	images: string[]
	name: string
	isMobile?: boolean | false
}
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL

export const ImageCarousel: React.FC<Props> = ({
	className,
	images,
	name,
	isMobile,
}) => {
	const isDefaultImage = images[0] ? false : true
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeImage, setActiveImage] = useState<string | null>(
		images[0] || null,
	)
	const [isModalLoading, setIsModalLoading] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [isCarouselLoaded, setIsCarouselLoaded] = useState(false)

	const handleImageSet = (image: string) => {
		setActiveImage(image)
		setIsLoading(true)
	}
	const handleModalImageLoad = () => {
		setIsModalLoading(false)
	}
	const handleImageLoad = () => {
		setIsLoading(false)
		setIsCarouselLoaded(true)
	}

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setIsModalLoading(true)
	}

	return (
		<div className={cn('pl-2', className)}>
			{/* Основное изображение */}
			{isDefaultImage ? (
				<Image
					src={'/logo_black.svg'}
					alt={name}
					quality={5}
					width={isMobile ? 200 : 500}
					height={isMobile ? 200 : 500}
					className={cn(
						'object-contain relative bg-background rounded-xl mx-auto',
						isMobile ? 'h-[200px]' : 'h-[450px]',
					)}
				/>
			) : (
				<div className='relative flex justify-center mb-2 w-full'>
					{/* Обернут в отдельный контейнер с relative */}
					{isLoading && (
						<div
							className={cn(
								'absolute flex items-center justify-center bg-background  w-full h-full bg-opacity-50 rounded-xl p-4 animate-pulse mx-auto',
								isMobile ? 'min-h-[330px]' : 'min-h-[450px]',
								isMobile ? 'w-[200px] mx-auto' : '',
							)}
						>
							<div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
						</div>
					)}
					<Image
						src={imageBaseUrl + activeImage!}
						alt={name}
						quality={40}
						width={isMobile ? 200 : 500}
						height={isMobile ? 200 : 500}
						className={cn(
							'object-contain rounded-xl border-white border-[10px] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 mx-auto',

							{
								'opacity-0': isLoading,
								'opacity-100': !isLoading,
							},
						)}
						onClick={() => openModal()} // Открыть модальное окно
						onLoad={() => handleImageLoad()}
					/>
				</div>
			)}

			{/* Карусель */}
			{images.length > 1 && (
				<div
					className={cn('relative transition-all duration-300', {
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
						<CarouselContent className='p-1'>
							{images.map((image, index) => (
								<CarouselItem key={index} className='basis-1/3'>
									<div>
										<Card className='shadow-sm cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300 min-h-[70px] my-4'>
											<CardContent
												className='flex aspect-square items-center justify-center p-1'
												onClick={() => handleImageSet(image)}
											>
												<Image
													src={imageBaseUrl + image}
													alt={name}
													height={70}
													width={70}
													quality={1}
													className=' rounded-xl'
												/>
											</CardContent>
										</Card>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{!isDefaultImage && images.length > 3 && (
							<>
								<CarouselPrevious className='absolute -left-4 text-foreground hover:bg-primary bg-background' />
								<CarouselNext className='absolute -right-4 text-foreground hover:bg-primary bg-background' />
							</>
						)}
					</Carousel>
				</div>
			)}

			{/* Модальное окно */}
			{isModalOpen && activeImage && (
				<ModalImage onClose={closeModal}>
					<div className='relative p-0 overflow-hidden flex justify-center items-center lg:h-[650px] lg:w-[650px] xl:w-[650px] xl:h-[650px] 2xl:w-[800px] 2xl:h-[800px]'>
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
							className='object-contain rounded-xl'
							onLoad={() => handleModalImageLoad()}
						/>
					</div>
				</ModalImage>
			)}
		</div>
	)
}
