import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

export const DeliveryTab: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={cn('h-[300px] p-4 bg-card rounded-xl shadow-lg', className)}
		>
			Быстрая и удобная доставка спецодежды от компании «Главсиз»
			<p>
				Компания «Главсиз» заботится о том, чтобы наши клиенты получали
				спецодежду максимально быстро и удобно.
				<br />
				<br />
				Мы предлагаем различные варианты доставки, чтобы соответствовать вашим
				потребностям:
				<br />
				• Доставка до транспортной компании по вашему выбору.
				<br />
				<br />
				Условия доставки:
				<br />• Бесплатная доставка по Уфе и Казани при заказе на сумму свыше 15
				000 рублей.
			</p>
		</div>
	)
}
