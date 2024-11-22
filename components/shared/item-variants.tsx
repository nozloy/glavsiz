import React from 'react'
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
	return (
		<div className={cn('flex flex-col gap-2 items-start py-6', className)}>
			<p className='text-md text-muted-foreground'>Варианты:</p>
			<Select
				defaultValue={variants[0].id.toString()}
				onValueChange={handleSelectChange}
			>
				<SelectTrigger className='w-auto min-w-[200px] border-none bg-card text-lg'>
					<SelectValue placeholder={variants[0].name} />
				</SelectTrigger>
				<SelectContent>
					{variants
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(item => (
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
