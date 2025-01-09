import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

export const MobileFooter: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-centerp-4 text-sm text-muted-foreground p-4 pb-8 mt-auto',
				className,
			)}
		>
			2021-2025 © ООО ГЛАВСИЗ
			<p>ИНН 0273943621 ОГРН 1210200050422</p>
		</div>
	)
}
