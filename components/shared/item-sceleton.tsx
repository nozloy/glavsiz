import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { isMobile } from '@/lib/is-mobile'

interface Props {
	className?: string
	isMobile?: boolean | false
}

export const ItemSceleton: React.FC<Props> = ({ className, isMobile }) => {
	return (
		<Skeleton
			className={cn(
				' bg-primary/5 flex drop-shadow-md shadow-md',
				isMobile ? 'h-[360px] min-w-[230px]' : 'h-[460px] w-[290px]',
				className,
			)}
		>
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
	)
}
