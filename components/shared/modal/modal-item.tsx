'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Item, Category, Season } from '@prisma/client'
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ItemCode } from '../item-code'
import { ItemCount } from '../item-count'
import { ItemVariants } from '../item-variants'
import { ItemProps } from '../item-props'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
						<div className='flex flex-col gap-3'>
							<div className='flex justify-between items-center'>
								{variants && variants[1] && (
									<ItemVariants
										variants={variants}
										onVariantChange={handleVariantChange}
									/>
								)}
								<ItemCount
									className='relative top-4'
									id={selectedVariant?.id || item.id || 0}
									count={selectedVariant?.count || item.count || 0}
								/>
							</div>

							{item?.season && (
								<ItemProps
									propsName='Сезон'
									propsValue={
										item.season == Season.Summer ? 'Весна-Лето' : 'Осень-Зима'
									}
								/>
							)}
							{item?.composition && (
								<ItemProps
									propsName='Состав комплекта'
									propsValue={item.composition}
								/>
							)}
							{item?.sizes && (
								<ItemProps propsName='Размерный ряд' propsValue={item.sizes} />
							)}
							{item?.heights && (
								<ItemProps propsName='Рост' propsValue={item.heights} />
							)}
							{item?.color && (
								<ItemProps propsName='Цвет' propsValue={item.color} />
							)}
							{item?.materials && (
								<ItemProps propsName='Материалы' propsValue={item.materials} />
							)}
							{item?.materialLiner && (
								<ItemProps
									propsName='Подкладка'
									propsValue={item.materialLiner}
								/>
							)}
							{item?.materialInsulation && (
								<ItemProps
									propsName='Утеплитель'
									propsValue={item.materialInsulation}
								/>
							)}
						</div>
						<DialogFooter className='mt-auto'>
							<Link href={'/item/' + item.id} target='_parent'>
								<Button className='text-lg'>Подробнее</Button>
							</Link>
						</DialogFooter>
					</div>
				</DialogContent>
			</DialogOverlay>
		</Dialog>
	)
}
