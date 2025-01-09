import React from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
	children: React.ReactNode
	onClose: () => void
	className?: string
}

const ModalImage: React.FC<ModalProps> = ({ children, onClose, className }) => {
	return (
		<div
			className={cn(
				'fixed inset-0 z-50 flex items-center justify-center bg-foreground/50',
				className,
			)}
			onClick={onClose}
		>
			<div
				className='relative bg-background p-2 rounded-lg shadow-lg max-w-[90vw] max-h-[90vh]'
				onClick={e => e.stopPropagation()}
			>
				{children}
				<button
					onClick={onClose}
					className='absolute top-2 right-4 text-muted-foreground hover:text-foreground text-4xl'
				>
					&times;
				</button>
			</div>
		</div>
	)
}

export default ModalImage
