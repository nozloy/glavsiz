'use client'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import React, { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { PriceSlider } from '../price-slider'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useDebounce } from 'react-use'

interface Props {
	className?: string
	itemTypes: string[]
}

export const MobileFilters: React.FC<Props> = ({ className, itemTypes }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	// Локальное состояние для отображения всех типов
	const [showAll, setShowAll] = useState(false)

	// Локальное состояние для диапазона цен
	const [priceRange, setPriceRange] = useState<number[]>([
		Number(searchParams.get('priceFrom') || 0),
		Number(searchParams.get('priceTo') || 20000),
	])
	const [activeTypes, setActiveTypes] = useState<string[]>([])
	const displayedTypes = showAll ? itemTypes : itemTypes.slice(0, 8)
	// Дебаунс значения диапазона цен
	useDebounce(
		() => {
			const params = new URLSearchParams(searchParams.toString())
			params.set('priceFrom', priceRange[0].toString())
			params.set('priceTo', priceRange[1].toString())
			params.set('types', activeTypes.join(','))
			router.push(`?${params.toString()}`)
		},
		500,
		[priceRange, activeTypes],
	)

	// Обновление состояния при изменении диапазона цен
	const handlePriceChange = (values: number[]) => {
		setPriceRange(values)
	}
	const handleTypesChange = (types: string[]) => {
		setActiveTypes(types) // Обновляем состояние с выбранными типами
	}
	return (
		<div
			className={cn(
				'flex sticky bottom-6 right-6 rounded-xl p-2 bg-secondary w-12 ml-auto  border-2 border-dashed border-muted-foreground ',
				className,
			)}
		>
			<Drawer>
				<DrawerTrigger asChild>
					<SlidersHorizontal size={30} className='text-muted-foreground' />
				</DrawerTrigger>
				<DrawerContent>
					<div className='mx-auto w-full max-w-sm'>
						<DrawerHeader>
							<DrawerTitle>Фильтры</DrawerTitle>
						</DrawerHeader>
						<div className='p-4 pb-0'>
							<div className='flex flex-col gap-4 w-full'>
								<div></div>
								<PriceSlider
									priceRange={priceRange}
									onPriceChange={handlePriceChange}
								/>
							</div>
						</div>
						<DrawerFooter></DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	)
}
