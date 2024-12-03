import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

interface Props {
	className?: string
}

export const ItemSceleton: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('', className)}>
			<Skeleton className=' h-[460px] w-[290px] bg-primary/5 flex drop-shadow-md shadow-lg'>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					className='opacity-70 mx-auto my-auto h-52 w-52'
					src={'/logo_black.svg'}
					alt='logo'
				/>
				{/* <Image
					src={'/logo_black.svg'}
					alt='logo'
					quality={5}
					width={200}
					height={200}
					className=' opacity-70 mx-auto my-auto'
				/> */}
			</Skeleton>
		</div>
	)
}
