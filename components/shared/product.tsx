'use client'
import React, { useState } from 'react'
import { Item, Category, Season } from '@prisma/client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ItemCode } from '@/components/shared/item-code'
import { ItemCount } from '@/components/shared/item-count'
import { ItemDescription } from '@/components/shared/item-description'
import { ItemVariants } from '@/components/shared/item-variants'
import { Container } from './container'
import { ItemProps } from './item-props'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'
import { ShareButton } from './share-button'

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
			<div
				className={cn(
					'grid grid-cols-[minmax(300px,300px)_minmax(0,400px)_minmax(400px,1fr)] w-full gap-10 bg-secondary p-4 rounded-2xl',
					className,
				)}
			>
				<div className='flex justify-center items-center '>
					<Image
						src={item.images[0]}
						alt={item.name}
						width={300}
						height={300}
						className='rounded-xl border-white border-[10px]'
					/>
				</div>

				<div className='flex flex-col'>
					<p className='text-3xl font-bold text-balance'>{item.name}</p>

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
						{item?.season && item?.brand && item?.materials && item?.color && (
							<p className='text-2xl font-bold'>О товаре</p>
						)}

						{item?.brand && (
							<ItemProps propsName='Бренд' propsValue={item.brand} />
						)}

						{item?.season && (
							<ItemProps
								propsName='Сезон'
								propsValue={
									item.season == Season.Summer ? 'Весна-Лето' : 'Осень-Зима'
								}
							/>
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

						{/* <ItemDescription
							className='mt-auto'
							description={item.description ? item.description : 'Нет описания'}
						></ItemDescription> */}
					</div>
				</div>
				<div className='flex flex-col items-end justify-start gap-5'>
					<div className='flex flex-row gap-3 pr-4'>
						<ItemCode code={item.vendorCode || 'Нет артикула'} />
						<ShareButton />
					</div>

					<div className='w-full neo rounded-2xl p-4'>
						<div className='flex flex-row items-end gap-2'>
							<p className='w-min text-3xl font-bold bg-primary text-secondary p-2 px-4 rounded-2xl drop-shadow-md select-none'>
								{item.price}₽
							</p>
							<p className='relative bottom-3 text-muted-foreground text-md  '>
								при заказе на сайте
							</p>
						</div>
						<div className='flex flex-row gap-2 justify-between pt-6'>
							<Button
								variant={'default'}
								size={'lg'}
								className='text-lg font-bold p-8 bg-primary text-secondary  drop-shadow-md hover:drop-shadow-lg hover:scale-105 transition-all delay-75'
							>
								Добавить в корзину
							</Button>
							<Button
								variant={'default'}
								size={'lg'}
								className='text-lg font-bold p-8 bg-primary/20 hover:bg-primary/60 text-primary hover:text-card drop-shadow-md *:hover:animate-pulse hover:drop-shadow-lg hover:scale-105 transition-all delay-75'
							>
								<Heart size={32} />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Container>
	)
}
