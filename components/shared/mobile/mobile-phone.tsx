'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getCity } from '@/lib/get-city'
import { useCityStore } from '@/store/city-store'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
	className?: string
}

export const MobilePhone: React.FC<Props> = ({ className }) => {
	const { activeCity } = useCityStore()
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
				className='shadow-md bg-card border border-dashed rounded-b-xl p-2 mr-4 text-md text-secondary-foreground flex items-center'
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
