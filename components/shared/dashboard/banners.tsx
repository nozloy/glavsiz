import React from 'react'
import { cn } from '@/lib/utils'
import { BannerCarousel } from '../banner-carousel'
import { Container } from '../container'

interface Props {
	className?: string
}

export const Banners: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('p-4', className)}>
			<Container className='border border-primary border-dashed'>
				<BannerCarousel />
			</Container>
		</div>
	)
}
