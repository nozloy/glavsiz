import React from 'react'
import { cn } from '@/lib/utils'
import { MobileMenu } from './mobile-menu'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { MobileChooseCity } from './mobile-choose-city'
import { MobilePhone } from './mobile-phone'

interface Props {
	className?: string
}

export const MobileHeader: React.FC<Props> = ({ className }) => {
	return (
		<div className='sticky top-0 z-50'>
			<div
				className={cn(
					'p-4 flex flex-row gap-2 items-center justify-between rounded-b-lg bg-card shadow-md w-full',
					className,
				)}
			>
				<MobileMenu />
				<Image src={'/icon2.svg'} alt='logo' width={24} height={24} />
				<Search size={24} />
			</div>
			<div className='w-full flex items-start justify-end '>
				<MobilePhone />
				<MobileChooseCity />
			</div>
		</div>
	)
}
