import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { DeliveryTab } from './delivery-tab'
import { DiscountTab } from './discount-tab'
import { BrandingTab } from './branding-tab'
import { RefundTab } from './refund-tab'

interface Props {
	className?: string
}

export const Benefits: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('w-full h-[400px]', className)}>
			<Tabs defaultValue='delivery' className=' text-xl'>
				<TabsList className='*:text-4xl'>
					<TabsTrigger value='delivery'>Доставка</TabsTrigger>
					<TabsTrigger value='discount'>Скидки</TabsTrigger>
					<TabsTrigger value='branding'>Брендирование</TabsTrigger>
					<TabsTrigger value='refund'>Возврат</TabsTrigger>
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
