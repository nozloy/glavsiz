import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
	color: string
}

export const ItemColor: React.FC<Props> = ({ className, color }) => {
	return (
		<div className={cn('flex flex-row gap-1', className)}>
			<p className='text-md text-muted-foreground'>Цвет:</p>
			<p className='text-md text-secondary-foreground'>{color}</p>
		</div>
	)
}
