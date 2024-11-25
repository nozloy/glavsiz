import React from 'react'
import { cn } from '@/lib/utils'
import { LoaderCircle } from 'lucide-react'

interface Props {
	className?: string
}

export const Loading: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={cn(
				'flex flex-row gap-2 items-center justify-center',
				className,
			)}
		>
			<LoaderCircle className='animate-spin'></LoaderCircle>Загрузка
		</div>
	)
}
