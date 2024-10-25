import React from 'react'
import { cn } from '@/lib/utils'
import { Share } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
	className?: string
}

export const ShareButton: React.FC<Props> = ({ className }) => {
	const handleSharePage = () => {
		navigator.clipboard.writeText(window.location.href)
		toast('Адрес скопирован в буфер обмена', {
			icon: '📋',
			duration: 2000,
		})
	}
	return (
		<div
			className={cn(
				'flex flex-row gap-1 items-center text-secondary-foreground cursor-pointer',
				className,
			)}
			onClick={handleSharePage}
		>
			<Share size={16} />
			Поделиться
		</div>
	)
}
