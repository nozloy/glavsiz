import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Props {
	className?: string
}

export const ItemNotFound: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('', className)}>
			<div className='w-full h-full pt-24 flex flex-col items-center justify-center gap-4'>
				<Image
					src='/logo_black.svg'
					alt='404'
					priority
					width={288}
					height={288}
				/>
				<h2 className='text-3xl font-bold'>Ошибка 404</h2>
				<p>Не можем найти товар с таким ID</p>
			</div>
		</div>
	)
}
