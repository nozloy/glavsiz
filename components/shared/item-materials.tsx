import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
	material: string
}

export const ItemMaterials: React.FC<Props> = ({ className, material }) => {
	return (
		<div className={cn('', className)}>
			<div className='flex flex-row gap-1'>
				<p className='text-md text-muted-foreground'>Материалы:</p>
				<p className='text-md text-secondary-foreground'>{material}</p>
			</div>
		</div>
	)
}
