import React from 'react'
import { cn } from '@/lib/utils'
import { MobileMenu } from './mobile-menu'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { MobileChooseCity } from './mobile-choose-city'
import { MobilePhone } from './mobile-phone'
import { SearchInput } from '../search-input'
import Link from 'next/link'

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

				<SearchInput className='h-10 px-1' />
				<Link
					href='/'
					className='active:bg-muted-foreground/50 rounded-full p-1'
				>
					<Image
						src={'/icon2.svg'}
						alt='logo'
						width={30}
						height={30}
						className='select-none'
					/>
				</Link>
			</div>
			<div className='w-full flex items-start justify-end '>
				<MobilePhone />
				<MobileChooseCity />
			</div>
		</div>
	)
}
