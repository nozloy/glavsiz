import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { env } from 'process'

interface Props {
	className?: string
	size?: number
}

export const Instagram: React.FC<Props> = ({ className, size }) => {
	return (
		<Link
			href={env.SOCIAL_INSTAGRAM_URL || '#'}
			className={cn(
				'rounded-[4px] hover:scale-125 hover:shadow-md hover:shadow-primary-foreground duration-300 transition-all text-primary',
				className,
			)}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width={size || 24}
				height={size || 24}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				<rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
				<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
				<line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
			</svg>
		</Link>
	)
}
