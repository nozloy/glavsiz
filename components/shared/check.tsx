'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { allItems } from '@/lib/find-items'
import { SheetCatalog } from './sheet-catalog'
import { Container } from './container'
import { Separator } from '../ui/separator'
import { ItemWithOfferOnly } from '@/@types'
import { ErrorItemsCheck } from './error-items-check'
import { Loading } from './loading'

interface Props {
	className?: string
}

export const Check: React.FC<Props> = ({ className }) => {
	const [items, setItems] = useState<ItemWithOfferOnly[]>([])
	const [errorItems, setErrorItems] = useState<ItemWithOfferOnly[]>([])
	const [checked, setChecked] = useState(true)

	const changeCheckbox = () => {
		setChecked(!checked)
	}

	// Загрузка данных
	useEffect(() => {
		const fetchData = async () => {
			try {
				const itemsData = await allItems()
				const errorItemsData = itemsData.filter(
					(item: ItemWithOfferOnly) =>
						!item.images?.[0] ||
						!item.Offer?.[0] ||
						(item.Offer?.[1] && item.Offer.some(offer => !offer.name)),
				)
				setItems(itemsData)
				setErrorItems(errorItemsData)
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
			}
		}

		fetchData()
	}, []) // Пустой массив зависимостей, чтобы вызвать useEffect один раз при монтировании

	return (
		<Container className={cn('bg-secondary flex flex-col gap-4 ', className)}>
			<div className='flex flex-col gap-4 rounded-xl bg-background p-5 shadow-xl'>
				<div className='text-xl'>Опции отображения</div>
				<Separator />
				<ErrorItemsCheck checked={checked} onChange={changeCheckbox} />
			</div>
			{items.length <= 0 && <Loading />}
			{items.length > 0 && (
				<SheetCatalog items={checked ? errorItems : items} />
			)}
		</Container>
	)
}
