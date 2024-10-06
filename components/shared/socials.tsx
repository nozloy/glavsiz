import React from 'react'
import { cn } from '@/lib/utils'
import { Instagram, Telegram, Vk, Youtube } from './icons'

interface Props {
	className?: string
}

export const Socials: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('flex flex-row gap-2 items-center ', className)}>
			<Telegram />
			<Youtube />
			<Instagram />
			<Vk />
		</div>
	)
}
