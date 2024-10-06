import React from 'react'
import { cn } from '@/lib/utils'
import { allCategories, allItems } from '@/lib/find-items'
import { SheetCatalog } from './sheet-catalog'

interface Props {
	className?: string
}

export const Check: React.FC<Props> = async ({ className }) => {
	const items = await allItems()
	const categories = await allCategories()
	return (
		<div className='bg-secondary'>
			<SheetCatalog items={items} categories={categories} />
		</div>
	)
}
