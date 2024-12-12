'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getCity } from '@/lib/get-city'
import { Skeleton } from '../ui/skeleton'

interface Props {
	className?: string
	activeCity: string
}

export const TelephoneLink: React.FC<Props> = ({ className, activeCity }) => {
	const [phone, setPhone] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		const fetchPhone = async () => {
			setIsLoading(true)
			const city = await getCity(activeCity)
			setPhone(city?.phone || null)
			setIsLoading(false)
		}
		fetchPhone()
	}, [activeCity])

	return (
		<div className={cn('', className)}>
			<Link
				className='focus:underline focus:outline-none pr-2 font-semibold text-md text-secondary-foreground flex items-center'
				href={phone ? `tel:${phone}` : '#'}
			>
				{!isLoading ? (
					phone
				) : (
					<Skeleton className='w-[140px] h-[22px] rounded-xl bg-muted-foreground' />
				)}
			</Link>
		</div>
	)
}
