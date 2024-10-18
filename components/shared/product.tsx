'use client'
import React, { useState } from 'react'
import { Item, Category } from '@prisma/client'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ItemMaterials } from '@/components/shared/item-materials'
import { ItemColor } from '@/components/shared/item-color'
import { ItemCode } from '@/components/shared/item-code'
import { ItemCount } from '@/components/shared/item-count'
import { ItemDescription } from '@/components/shared/item-description'
import { ItemVariants } from '@/components/shared/item-variants'
import { Container } from './container'

interface Props {
	className?: string
	item: Item
	category: Category
	variants?: Item[]
}

export const Product: React.FC<Props> = ({
	className,
	item,
	category,
	variants,
}) => {
	const [selectedItemId, setSelectedItemId] = useState<number>(item.id)

	const selectedVariant = variants?.find(
		variant => variant.id === selectedItemId,
	)
	const handleVariantChange = (itemId: number) => {
		setSelectedItemId(itemId)
	}
	return (
		<Container>
			<div className={cn('flex flex-row', className)}>
				<Image src={item.images[0]} alt={item.name} width={300} height={300} />
				<div className='flex flex-col'>
					<div>{category.name}</div>
					<p className='text-2xl'>{item.name}</p>
					<ItemCode code={item.vendorCode || 'Нет артикула'} />
					<div className='flex flex-col gap-3  pt-4'>
						<ItemColor color={item.color ? item.color : 'Нет цвета'} />
						<ItemMaterials
							material={item.materials ? item.materials : 'Нет материала'}
						/>
						<div className='flex flex-row gap-5 items-center'>
							{variants && variants[1] && (
								<ItemVariants
									variants={variants}
									onVariantChange={handleVariantChange}
								/>
							)}
							<ItemCount
								id={selectedVariant?.id || item.id || 0}
								count={selectedVariant?.count || item.count || 0}
							/>
						</div>

						<ItemDescription
							className='mt-auto'
							description={item.description ? item.description : 'Нет описания'}
						></ItemDescription>
					</div>
				</div>
			</div>
		</Container>
	)
}
