import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { BannerCarousel } from './banner-carousel'

interface Props {
	className?: string
}

export const MobileVersion: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('bg-background h-full', className)}>
			<div className='flex flex-col items-center justify-center p-4 h-full'>
				<Link className='focus:outline-primary' href='/'>
					<Image
						src='/logo.svg'
						alt='logo'
						width={288}
						height={80}
						className='w-72 h-20 mb-5'
					/>
				</Link>
				{/* <BannerCarousel /> */}
				<div className='text-center text-3xl font-bold'>
					Мобильная версия находится в разработке. Для просмотра каталога -
					посетите наш сайт на ПК.
				</div>
			</div>
		</div>
	)
}
