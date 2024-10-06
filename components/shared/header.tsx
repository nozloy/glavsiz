import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import Link from 'next/link'
import {
	Container,
	CartButton,
	ChooseCity,
	SearchInput,
} from '@/components/shared'
import { TelephoneLink } from './telephone-link'
import { ParentCategoriesMenu } from './parent-categories-menu'

interface Props {
	className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
	return (
		<header className={cn(' bg-background', className)}>
			<Container className='flex flex-col gap-2 pb-0'>
				<div className='flex items-center justify-between bg-secondary p-1 rounded-xl'>
					{/* Левая сторона - город */}
					<ChooseCity className='flex items-center gap-1' />
					{/* Правая сторона - телефон */}
					<TelephoneLink />
				</div>
				<div className='flex items-center justify-between py-2'>
					{/* Левая сторона - лого */}
					<Link className='focus:outline-primary' href='/'>
						<Image
							src='/logo.svg'
							alt='logo'
							width={288}
							height={80}
							className='w-72 h-20 mb-5'
						/>
					</Link>

					<div className='mx-10 flex-1'>
						<SearchInput />
					</div>

					{/* Правая сторона - меню */}
					<div className='flex items-center gap-3'>
						<Button variant={'outline'} className='flex items-center gap-1'>
							<User size={16} />
							Войти
						</Button>
						<div>
							<CartButton />
						</div>
					</div>
				</div>
				{/* <div className='flex flex-row justify-between items-center pb-2 pl-2'>
					<ParentCategoriesMenu />
				</div> */}
			</Container>
		</header>
	)
}
