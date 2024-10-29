import React from 'react'
import { cn } from '@/lib/utils'
import { CountIconButton } from './count-icon-button'

interface Props {
	value?: number
	size?: 'sm' | 'lg'
	onClick?: (type: 'plus' | 'minus') => void
	className?: string
}

export const CountButton: React.FC<Props> = ({
	className,
	onClick,
	value = 1,
	size = 'sm',
}) => {
	return (
		<div
			className={cn(
				'inline-flex items-center justify-between gap-3',
				className,
			)}
		>
			<CountIconButton
				onClick={() => onClick?.('minus')}
				disabled={value === 1}
				size={size}
				type='minus'
			/>

			<b className={size === 'sm' ? 'text-sm' : 'text-md'}>{value}</b>

			<CountIconButton
				onClick={() => onClick?.('plus')}
				size={size}
				type='plus'
			/>
		</div>
	)
}
