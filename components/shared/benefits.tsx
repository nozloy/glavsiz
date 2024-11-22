'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { DeliveryTab } from './delivery-tab'
import { DiscountTab } from './discount-tab'
import { BrandingTab } from './branding-tab'
import { RefundTab } from './refund-tab'
import { BadgePercent, PackageCheck, SquareAsterisk, Truck } from 'lucide-react'

interface Props {
	className?: string
}

export const Benefits: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('w-full h-[450px]', className)}>
			<Tabs defaultValue='delivery' className='text-xl *:items-start'>
				<TabsList className='*:text-4xl'>
					<TabsTrigger value='delivery' className=''>
						Доставка
						<Truck size={30} className='mt-auto pl-1' />
					</TabsTrigger>
					<TabsTrigger value='discount'>
						Скидки
						<BadgePercent size={30} className='mt-auto pl-1' />
					</TabsTrigger>
					<TabsTrigger value='branding'>
						Брендирование
						<SquareAsterisk size={30} className='mt-auto pl-1' />
					</TabsTrigger>
					<TabsTrigger value='refund'>
						Возврат
						<PackageCheck size={30} className='mt-auto pl-1' />
					</TabsTrigger>
				</TabsList>
				<TabsContent value='delivery'>
					<DeliveryTab />
				</TabsContent>
				<TabsContent value='discount'>
					<DiscountTab />
				</TabsContent>
				<TabsContent value='branding'>
					<BrandingTab />
				</TabsContent>
				<TabsContent value='refund'>
					<RefundTab />
				</TabsContent>
			</Tabs>
		</div>
	)
}
