'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Item, Category } from '@prisma/client'
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ItemMaterials } from '../item-materials'
import { ItemColor } from '../item-color'
import { ItemCode } from '../item-code'
import { ItemCount } from '../item-count'
import { ItemDescription } from '../item-description'
import { ItemVariants } from '../item-variants'

interface Props {
	className?: string
	item: Item
	category: Category
	variants?: Item[]
}

export const ModalItem: React.FC<Props> = ({
	className,
	item,
	category,
	variants,
}) => {
	const router = useRouter()
	const [selectedItemId, setSelectedItemId] = useState<number>(item.id)

	const selectedVariant = variants?.find(
		variant => variant.id === selectedItemId,
	)
	const handleVariantChange = (itemId: number) => {
		setSelectedItemId(itemId)
	}

	return (
		<Dialog open={Boolean(item)} onOpenChange={() => router.back()}>
			<DialogOverlay className='fixed inset-0 bg-black/25 grid place-items-center overflow-y-auto overflow-scroll'>
				<DialogContent
					className={cn(
						'p-0 w-[890px] max-w-[890px] h-[630px] bg-white overflow-hidden flex',
						className,
					)}
				>
					<div className='w-[382px] h-full flex-1'>
						<Image
							src={item.images[0]}
							alt={item.name}
							width={382}
							height={509}
							className=' relative top-2 left-2 transition-all z-10 duration-300'
						/>
					</div>
					<div className='w-[490px] bg-secondary/50 p-5 flex flex-col gap-1 shadow-md rounded-r-xl '>
						<DialogHeader className='flex flex-col gap-1'>
							<div className='flex flex-row justify-between'>
								<DialogDescription>{category.name}</DialogDescription>
							</div>
							<DialogTitle className='flex flex-col gap-2'>
								<p className='text-2xl'>{item.name}</p>

								<ItemCode code={item.vendorCode || 'Нет артикула'} />
							</DialogTitle>
						</DialogHeader>
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
								description={
									item.description ? item.description : 'Нет описания'
								}
							></ItemDescription>
						</div>
					</div>
				</DialogContent>
			</DialogOverlay>
		</Dialog>
	)
}
