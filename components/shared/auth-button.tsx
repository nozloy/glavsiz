'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { CircleUser, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Props {
	onClickSignIn?: () => void
	className?: string
}

export const AuthButton: React.FC<Props> = ({ className, onClickSignIn }) => {
	const { data: session } = useSession()
	return (
		<div className={cn('', className)}>
			{!session ? (
				<Button
					variant={'outline'}
					className='flex items-center gap-1'
					onClick={onClickSignIn}
				>
					<User size={16} />
					Войти
				</Button>
			) : (
				<Link href={'/profile'}>
					<Button variant={'outline'} className='flex items-center gap-1'>
						<CircleUser size={16} />
						Профиль
					</Button>
				</Link>
			)}
		</div>
	)
}
