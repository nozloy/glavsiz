import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

export const MobileVersion: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('', className)}>
			<div className='flex flex-col items-center justify-center p-4'>
				<div className='text-center text-3xl font-bold'>
					Мобильная версия находится в разработке. Для просмотра каталога -
					посетите наш сайт на ПК.
				</div>
			</div>
		</div>
	)
}
