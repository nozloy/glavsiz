import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

interface Props {
	className?: string
	propsName: String
	propsValue: String
}

export const ItemProps: React.FC<Props> = ({
	className,
	propsName,
	propsValue,
}) => {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<div className='flex flex-row gap-1 justify-between'>
				<p className='text-md text-muted-foreground'>{propsName}:</p>
				<p className='text-md text-secondary-foreground text-right'>
					{propsValue}
				</p>
			</div>
			<Separator />
		</div>
	)
}
