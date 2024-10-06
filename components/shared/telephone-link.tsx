import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Props {
	className?: string
}

export const TelephoneLink: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('', className)}>
			<Link
				className='focus:underline focus:outline-none pr-2 font-semibold text-md text-secondary-foreground'
				href={'tel:+73472589008'}
			>
				+7 (347) 258-90-08
			</Link>
		</div>
	)
}
