import React from 'react'
import { cn } from '@/lib/utils'
import { Item } from '@prisma/client'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

interface Props {
	className?: string
	variants: Item[]
	onVariantChange: (id: number) => void
}

export const ItemVariants: React.FC<Props> = ({
	className,
	variants,
	onVariantChange,
}) => {
	const handleSelectChange = (value: string) => {
		const selectedId = parseInt(value)
		onVariantChange(selectedId)
	}
	return (
		<div className={cn('flex flex-col gap-2 items-start py-6', className)}>
			<p className='text-md text-muted-foreground'>Варианты:</p>
			<Select
				defaultValue={variants[0].id.toString()}
				onValueChange={handleSelectChange}
			>
				<SelectTrigger className='w-auto min-w-[200px] border-none bg-card text-lg'>
					<SelectValue placeholder={variants[0].size} />
				</SelectTrigger>
				<SelectContent>
					{variants.map(item => (
						<SelectItem
							className='text-lg'
							key={item.id}
							value={item.id.toString()}
						>
							{item.size}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
