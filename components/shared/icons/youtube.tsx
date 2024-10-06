import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { env } from 'process'

interface Props {
	className?: string
	size?: number
}

export const Youtube: React.FC<Props> = ({ className, size }) => {
	return (
		<Link
			href={env.SOCIAL_YOUTUBE_URL || '#'}
			className={cn(
				'rounded-full hover:scale-125 hover:shadow-md hover:shadow-primary-foreground duration-300 transition-all text-primary',
				className,
			)}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width={size || 28}
				height={size || 28}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				<circle cx='12' cy='12' r='10' />
				<polygon points='10 8 16 12 10 16 10 8' />
			</svg>
		</Link>
	)
}
