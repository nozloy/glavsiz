import React from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'
import { Socials } from './socials'

interface Props {
	className?: string
}

export const Footer: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('bg-background mt-auto hidden md:block', className)}>
			<Container>
				<div className='flex flex-row gap-2 justify-between items-center p-3 '>
					<p className='text-base font-bold text-muted-foreground'>
						2021-2024 © ООО ГЛАВСИЗ - Все права защищены их обладаетлями.
					</p>
					<Socials />
				</div>
			</Container>
		</div>
	)
}
