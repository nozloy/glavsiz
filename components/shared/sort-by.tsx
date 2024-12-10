'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'react-use'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
interface Props {
	className?: string
}

export const SortBy: React.FC<Props> = ({ className }) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	let [sortBy, setSortBy] = useState<string>('priceUp')

	// Дебаунс значения диапазона цен
	useDebounce(
		() => {
			const params = new URLSearchParams(searchParams.toString())
			params.set('sortBy', sortBy)
			router.push(`?${params.toString()}`)
		},
		200,
		[sortBy],
	)

	return (
		<div className={cn('pr-2', className)}>
			<div className='flex flex-row items-center'>
				<div className='text-muted-foreground text-sm'>Сортировать по:</div>
				<Select value={sortBy} onValueChange={value => setSortBy(value)}>
					<SelectTrigger className='w-auto min-w-[80px] border-none bg-secondary'>
						<SelectValue placeholder='Сортировать' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='priceUp'>возрастанию цены</SelectItem>
						<SelectItem value='priceDown'>убыванию цены</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
