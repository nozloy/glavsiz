import React from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

export const ChooseCity: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('', className)}>
			<p className='text-sm font-light pl-2 text-secondary-foreground'>
				Город:
			</p>
			<Select defaultValue='ufa'>
				<SelectTrigger className='w-auto min-w-[80px] border-none bg-secondary'>
					<SelectValue placeholder='Уфа' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='ufa'>Уфа</SelectItem>
					<SelectItem value='kazan'>Казань</SelectItem>
					<SelectItem value='eburg'>Екатеринбург</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
