'use client'
import React, { use, useEffect, useRef, useState } from 'react'
import { Item, Category, Season, Offer } from '@prisma/client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
	ItemCode,
	Container,
	ItemCount,
	ItemVariants,
} from '@/components/shared'
import { ItemProps } from './item-props'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'
import { ShareButton } from './share-button'
import { useCartStore } from '@/store/cart-store'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useCityStore } from '@/store/city-store'
import { PriceInfo } from '@/exchange/@types'
import { OfferWithTypedJson } from '@/store/@types'
import { motion } from 'framer-motion'

interface Props {
	className?: string
	item: Item
	category: Category
	offers?: Offer[]
}

export const Product: React.FC<Props> = ({
	className,
	item,
	category,
	offers,
}) => {
	const { activeCity } = useCityStore()
	const prevCityRef = useRef<string>()
	useEffect(() => {
		if (prevCityRef.current !== activeCity) {
			console.log('Город изменен на:', activeCity)
			prevCityRef.current = activeCity // Обновляем реф с новым значением
		}
	}, [activeCity])

	const { addCartItem, loading } = useCartStore(state => state)
	const [selectedOfferId, setSelectedOfferId] = useState<string>(
		offers?.[0]?.id || '',
	)
	const selectedOffer: OfferWithTypedJson | undefined = offers?.find(
		offer => offer.id === selectedOfferId,
	) as OfferWithTypedJson | undefined
	const handleVariantChange = (offerId: string) => {
		setSelectedOfferId(offerId)
	}

	const { data: session } = useSession()
	const fetchCartId = async (): Promise<number> => {
		const response = await fetch('/api/cart')
		if (!response.ok) throw new Error('Не удалось получить корзину')
		const data = await response.json()
		return data.cartId // cartId будет передан сервером
	}
	const handleAddCartItem = async () => {
		if (session && selectedOffer) {
			const cartId = await fetchCartId()

			if (!cartId) {
				toast('Не удалось получить корзину пользователя', {
					icon: '❗️',
					duration: 2000,
				})
				return
			}

			// Добавляем товар в Zustand
			addCartItem({
				id: String(Date.now()),
				cartId: cartId,
				offerId: selectedOffer.id,
				itemId: item.id,
				quantity: 1,
			})

			toast('Товар добавлен в корзину', {
				icon: '🛒',
				duration: 2000,
			})
		} else {
			toast('Сначала необходимо авторизоваться', {
				icon: '❗️',
				duration: 2000,
			})
		}
	}

	const isDefaultImage = item.images[0] ? false : true
	const infoAvailable = [
		item?.season,
		item?.materials,
		item?.color,
		item?.composition,
		item?.heights,
		item?.materialLiner,
		item?.materialInsulation,
	].some(Boolean)

	return (
		<Container>
			<div
				className={cn(
					'grid grid-cols-[minmax(300px,300px)_minmax(0,400px)_minmax(400px,1fr)] w-full gap-10 bg-secondary p-4 rounded-2xl min-h-[500px]',
					className,
				)}
			>
				{/* Изображение */}
				<div className='relative min-h-[300px] w-full flex justify-center items-center bg-background rounded-2xl'>
					<Image
						src={
							!isDefaultImage
								? 'https://cdn.glavsiz.ru/images/' + item.images[0]
								: '/logo_black.svg'
						}
						alt={item.name}
						quality={5}
						fill
						sizes='(max-width: 100px) 100vw, (max-width: 200px) 50vw, 33vw'
						className={cn('object-contain', {
							'opacity-30': isDefaultImage,
							'rounded-xl border-white border-[10px]': !isDefaultImage,
						})}
					/>
				</div>

				{/* Детали товара */}
				<div className='flex flex-col'>
					<p className='text-3xl font-bold text-balance'>{item.name}</p>

					<div className='flex flex-col gap-3'>
						<div className='flex justify-between items-center pb-5'>
							{offers && (
								<ItemVariants
									variants={offers}
									onVariantChange={handleVariantChange}
								/>
							)}
						</div>

						{infoAvailable && <p className='text-2xl font-bold'>О товаре</p>}

						{item?.season && (
							<ItemProps
								propsName='Сезон'
								propsValue={
									item.season === Season.Summer ? 'Весна-Лето' : 'Осень-Зима'
								}
							/>
						)}
						{item?.composition && (
							<ItemProps
								propsName='Состав комплекта'
								propsValue={item.composition}
							/>
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
				</div>

				{/* Добавить в корзину */}
				<div className='flex flex-col items-end justify-start gap-5'>
					<div className='flex flex-row gap-3 pr-4'>
						<ItemCode code={item.vendorCode || 'Нет артикула'} />
						<ShareButton />
					</div>
					<div className='w-full neo rounded-2xl p-4'>
						<div className='flex flex-row items-end gap-2'>
							<motion.div
								key={selectedOfferId + activeCity}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.3 }}
								className='text-3xl font-bold bg-primary text-secondary p-2 px-4 rounded-2xl drop-shadow-md select-none'
							>
								{selectedOffer?.price?.find((item: PriceInfo) =>
									item.name.includes(activeCity),
								)?.value
									? `${
											selectedOffer.price.find((item: PriceInfo) =>
												item.name.includes(activeCity),
											)?.value
									  }₽`
									: 'Под заказ'}
							</motion.div>
							<p className='relative bottom-3 text-muted-foreground text-md'>
								{selectedOffer?.price?.find((item: PriceInfo) =>
									item.name.includes(activeCity),
								)?.value
									? 'при заказе на сайте'
									: ''}
							</p>
						</div>
						<div className='flex flex-row gap-2 justify-between pt-6'>
							<Button
								// disabled={!session}
								disabled={true}
								loading={loading}
								onClick={handleAddCartItem}
								variant={'default'}
								size={'lg'}
								className='w-[250px] text-lg font-bold p-8 bg-primary text-secondary drop-shadow-md hover:drop-shadow-lg hover:scale-105 transition-all delay-75 active:scale-95 select-none'
							>
								Добавить в корзину
							</Button>
							<Button
								variant={'default'}
								size={'lg'}
								className='text-lg font-bold p-8 bg-primary/20 hover:bg-primary/60 text-primary hover:text-card drop-shadow-md hover:animate-pulse hover:drop-shadow-lg hover:scale-105 transition-all delay-75'
							>
								<Heart size={32} />
							</Button>
						</div>
					</div>
					<div className='flex items-end justify-start pr-4 text-md font-medium text-muted-foreground drop-shadow-md'>
						Наличие на складе:
					</div>

					<ItemCount
						id={selectedOfferId + activeCity}
						city={activeCity}
						warehouses={selectedOffer?.warehouse || []}
					/>
				</div>
			</div>
		</Container>
	)
}
