'use client'
import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Offer } from '@prisma/client'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

interface Props {
	className?: string
	variants: Offer[]
	onVariantChange: (id: string) => void
}

export const ItemVariants: React.FC<Props> = ({
	className,
	variants,
	onVariantChange,
}) => {
	const handleSelectChange = (value: string) => {
		const selectedId = value
		onVariantChange(selectedId)
	}
	const sortedVariants = variants.sort((a, b) => a.name.localeCompare(b.name))
	useEffect(() => {
		if (variants.length > 0) {
			onVariantChange(sortedVariants[0].id.toString())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // Пустой массив зависимостей, чтобы эффект сработал только 1 раз
	return (
		<div className={cn('flex flex-col gap-2 items-start py-6', className)}>
			<h2 className='text-md text-muted-foreground'>Варианты:</h2>
			<Select
				defaultValue={variants[0].id.toString()}
				onValueChange={handleSelectChange}
			>
				<SelectTrigger className='w-auto min-w-[200px] border-none bg-card text-lg'>
					<SelectValue placeholder={variants[0].name} />
				</SelectTrigger>
				<SelectContent>
					{sortedVariants.map(item => (
						<SelectItem
							className='text-lg'
							key={item.id}
							value={item.id.toString()}
						>
							{item.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
