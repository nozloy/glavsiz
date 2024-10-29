'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { CircleUser, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { Session } from 'next-auth'

interface Props {
	onClickSignIn?: () => void
	className?: string
	session?: Session
	status?: 'authenticated' | 'unauthenticated' | 'loading'
}

export const AuthButton: React.FC<Props> = ({
	className,
	onClickSignIn,
	session,
	status,
}) => {
	return (
		<div className={cn('', className)}>
			{!session ? (
				<Button
					loading={status === 'loading'}
					variant={'outline'}
					className='flex items-center gap-1 w-[100px]'
					onClick={onClickSignIn}
				>
					<User size={16} />
					Войти
				</Button>
			) : (
				<Link href={'/profile'}>
					<Button
						loading={status === 'loading'}
						variant={'outline'}
						className='flex items-center gap-1'
					>
						<CircleUser size={16} />
						Профиль
					</Button>
				</Link>
			)}
		</div>
	)
}
