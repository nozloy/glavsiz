'use client'

import React from 'react'
import { Checkbox } from '../ui/checkbox'

interface ErrorItemsCheckProps {
	checked: boolean
	onChange: () => void
}

export const ErrorItemsCheck: React.FC<ErrorItemsCheckProps> = ({
	checked,
	onChange,
}) => {
	return (
		<div className='flex flex-row gap-2 items-center'>
			<Checkbox id='error-check' checked={checked} onClick={onChange} />
			<label
				htmlFor='error-check'
				className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
			>
				Показывать только проблемные товары
			</label>
		</div>
	)
}
