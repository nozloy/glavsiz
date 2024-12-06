import React from 'react'
import { cn } from '@/lib/utils'
import { BestSellers } from '../best-sellers'
import { Container } from '../container'
import { Title } from '../title'

interface Props {
	className?: string
}

export const TopSelelrs: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('p-4', className)}>
			<Container className='border border-primary border-dashed'>
				<BestSellers />
			</Container>
		</div>
	)
}
