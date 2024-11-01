import React from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

interface Props {
	className?: string
	description: string
}

export const ItemDescription: React.FC<Props> = ({
	className,
	description,
}) => {
	return (
		<Container
			className={cn(
				'overflow-auto scrollbar min-h-[320px] bg-secondary rounded-2xl p-5 w-[1250px]',
				className,
			)}
		>
			<div className='text-2xl text-foreground py-2'>Описание:</div>
			{description}
		</Container>
	)
}
