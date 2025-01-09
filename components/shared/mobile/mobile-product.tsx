'use client'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ItemWithOffer } from '@/@types'
import { Title } from '../title'
import { Label } from '@radix-ui/react-select'
import { ImageCarousel } from '../image-carousel'
import { MobileImageCarousel } from './mobile-image-carousel'
import { ItemCode } from '../item-code'
import { ItemVariants } from '../item-variants'
import { OfferWithTypedJson } from '@/store/@types'
import { PriceInfo } from '@/exchange/@types'
import { useCityStore } from '@/store/city-store'
import { Badge } from '@/components/ui/badge'
import { ItemCount } from '../item-count'
import { ItemProps } from '../item-props'
import { Season } from '@prisma/client'

interface Props {
	className?: string
	item: ItemWithOffer
}

export const MobileProduct: React.FC<Props> = ({ className, item }) => {
	const { activeCity } = useCityStore()
	const prevCityRef = useRef<string>()
	useEffect(() => {
		if (prevCityRef.current !== activeCity) {
			prevCityRef.current = activeCity // Обновляем реф с новым значением
		}
	}, [activeCity])

	const [selectedOfferId, setSelectedOfferId] = useState<string>()

	//если есть второй оффер, значит будет выбран из компонента, если нет - всегда нулевой офер (единственный)
	const selectedOffer: OfferWithTypedJson | undefined = item.Offer[1]
		? (item.Offer?.find(offer => offer.id === selectedOfferId) as
				| OfferWithTypedJson
				| undefined)
		: (item.Offer?.[0] as OfferWithTypedJson | undefined)

	const handleVariantChange = (offerId: string) => {
		setSelectedOfferId(offerId)
	}
	const currentPrice = selectedOffer?.price?.find((item: PriceInfo) =>
		item.name.includes(activeCity),
	)?.value
		? selectedOffer.price.find((item: PriceInfo) =>
				item.name.includes(activeCity),
		  )?.value
		: null
	return (
		<div className={cn('flex flex-col gap-4 ', className)}>
			<div className='flex flex-col gap-0 rounded-xl shadow-xl bg-muted p-4 border border-dashed items-center'>
				{/* Название */}
				<h1 className='text-center text-2xl font-bold'>{item.name}</h1>
				{/* Изображение */}
				<MobileImageCarousel images={item.images} name={item.name} />

				<div className='flex flex-row gap-2 items-center justify-between'>
					{/* Артикул */}
					<ItemCode code={item.vendorCode} className='py-0' size='md' />
					{/* Цена */}
					<Badge className='text-2xl text-center'>
						{currentPrice ? `${currentPrice} ₽` : 'Под заказ'}
					</Badge>
				</div>
				<div>
					{item.Offer?.[1] && (
						<ItemVariants
							variants={item.Offer}
							onVariantChange={handleVariantChange}
						/>
					)}
				</div>
			</div>

			<div className='flex flex-col gap-2 rounded-xl shadow-xl bg-muted p-4 border border-dashed'>
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
				{item?.color && <ItemProps propsName='Цвет' propsValue={item.color} />}
				{item?.materials && (
					<ItemProps propsName='Материалы' propsValue={item.materials} />
				)}
				{item?.materialLiner && (
					<ItemProps propsName='Подкладка' propsValue={item.materialLiner} />
				)}
				{item?.materialInsulation && (
					<ItemProps
						propsName='Утеплитель'
						propsValue={item.materialInsulation}
					/>
				)}
				{item?.sole && <ItemProps propsName='Подошва' propsValue={item.sole} />}
			</div>
		</div>
	)
}
