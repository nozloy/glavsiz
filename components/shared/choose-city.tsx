'use client'
import React, { useEffect } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useCityStore } from '@/store/city-store'

interface Props {
	className?: string
}

export const ChooseCity: React.FC<Props> = ({ className }) => {
	const { activeCity, setActiveCity } = useCityStore()
	useEffect(() => {
		// Устанавливаем значение по умолчанию, если его нет
		if (!localStorage.getItem('active-city')) {
			setActiveCity('Уфа')
		}
	}, [setActiveCity])
	return (
		<div className={cn('', className)}>
			<p className='text-sm font-light pl-2 text-secondary-foreground'>
				Город:
			</p>
			<Select value={activeCity} onValueChange={value => setActiveCity(value)}>
				<SelectTrigger className='w-auto min-w-[80px] border-none bg-secondary'>
					<SelectValue placeholder='Выберите город' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='Уфа'>Уфа</SelectItem>
					<SelectItem value='Казань'>Казань</SelectItem>
					<SelectItem value='Екатеринбург'>Екатеринбург</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
