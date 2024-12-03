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

interface Props {
	className?: string
	images: string[]
	name: string
}
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL

export const ImageCarousel: React.FC<Props> = ({ className, images, name }) => {
	const isDefaultImage = images[0] ? false : true
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeImage, setActiveImage] = useState<string | null>(null)

	const [isLoading, setIsLoading] = useState(true)

	const handleImageLoad = () => {
		setIsLoading(false)
	}

	const openModal = (image: string) => {
		setActiveImage(image)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setActiveImage(null)
		setIsLoading(true)
	}

	return (
		<div className={cn('pl-2', className)}>
			<Carousel
				opts={{
					align: 'start',
					loop: true,
				}}
				className='h-full'
			>
				<CarouselContent className='h-full bg-background rounded-xl'>
					{isDefaultImage ? (
						<Image
							src={'/logo_black.svg'}
							alt={name}
							quality={5}
							width={500}
							height={500}
							className='object-contain'
						/>
					) : (
						images.map((image, index) => (
							<CarouselItem
								key={index}
								className='relative min-h-[300px] min-w-full w-full flex justify-center items-center bg-background rounded-2xl cursor-pointer'
								onClick={() => openModal(image)} // Открыть модальное окно
							>
								<Image
									src={imageBaseUrl + image}
									alt={name}
									quality={50}
									fill
									sizes='(max-width: 768px) 15vw, (max-width: 1200px) 25vw, 30vw'
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

			{/* Модальное окно */}
			{isModalOpen && activeImage && (
				<ModalImage onClose={closeModal}>
					<div className='relative p-0 overflow-hidden flex justify-center items-center lg:h-[650px] lg:w-[650px] xl:w-[700px] xl:h-[700px] 2xl:w-[800px] 2xl:h-[800px]'>
						{isLoading && (
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
							// width={340}
							// height={340}
							fill
							className='object-contain rounded-xl'
							onLoad={handleImageLoad}
						/>
					</div>
				</ModalImage>
			)}
		</div>
	)
}
