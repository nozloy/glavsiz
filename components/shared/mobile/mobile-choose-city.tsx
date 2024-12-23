'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useCityStore } from '@/store/city-store'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Props {
	className?: string
}

export const MobileChooseCity: React.FC<Props> = ({ className }) => {
	const { activeCity, setActiveCity } = useCityStore()
	const [menyCity, setMenuCity] = useState('Уфа')
	const [isOpen, setIsOpen] = useState(false)
	function onSubmit() {
		setActiveCity(menyCity)
		setIsOpen(false)
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className='border border-dashed rounded-b-xl'>
					<Button variant='ghost'>Город: {activeCity}</Button>
				</div>
			</DialogTrigger>
			<DialogContent className='max-w-[225px] rounded-xl'>
				<DialogHeader>
					<DialogTitle>Выберите город</DialogTitle>
				</DialogHeader>
				<RadioGroup
					defaultValue={activeCity}
					onValueChange={value => setMenuCity(value)}
				>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='Уфа' id='r1' />
						<Label htmlFor='r1'>Уфа</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='Казань' id='r2' />
						<Label htmlFor='r2'>Казань</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='Екатеринбург' id='r3' />
						<Label htmlFor='r3'>Екатеринбург</Label>
					</div>
				</RadioGroup>
				<DialogFooter>
					<Button type='submit' onClick={onSubmit}>
						Применить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
