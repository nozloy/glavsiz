import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
	description: string
}

export const ItemDescription: React.FC<Props> = ({
	className,
	description,
}) => {
	return (
		<div className={cn('overflow-auto scrollbar h-[320px]', className)}>
			{description}
		</div>
	)
}
