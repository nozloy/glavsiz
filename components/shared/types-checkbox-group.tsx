import React from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../ui/checkbox'
import { Title } from './title'

interface Props {
	className?: string
	itemTypes: string[]
	selectedTypes: string[] // Список выбранных типов, управляется родителем
	onTypesChange: (values: string[]) => void // Обработчик изменения
}

export const TypesCheckboxGroup: React.FC<Props> = ({
	className,
	itemTypes,
	selectedTypes,
	onTypesChange,
}) => {
	const handleCheckedChange = (type: string, checked: boolean) => {
		// В зависимости от состояния чекбокса, добавляем или удаляем его из списка
		const updatedTypes = checked
			? [...selectedTypes, type] // Добавляем тип, если чекбокс выбран
			: selectedTypes.filter(t => t !== type) // Убираем тип, если чекбокс снят

		// Вызываем обработчик изменения в родительском компоненте
		onTypesChange(updatedTypes)
	}

	return (
		<div className={cn('flex flex-col gap-1 p-1', className)}>
			<Title
				size='sm'
				className='text-left text-muted-foreground'
				text={'Вид изделия'}
			/>

			<div className='flex flex-col gap-1'>
				{itemTypes?.map((itemtype, index) => (
					<div key={index} className='flex items-center space-x-1'>
						<Checkbox
							id={itemtype}
							checked={selectedTypes.includes(itemtype)} // Проверяем, выбран ли тип
							onCheckedChange={checked =>
								handleCheckedChange(itemtype, checked ? true : false)
							} // Обрабатываем изменения
						/>
						<label
							htmlFor={itemtype}
							className='text-md leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
						>
							{itemtype}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}
