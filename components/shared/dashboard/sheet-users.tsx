import React from 'react'
import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Badge } from '../../ui/badge'

interface Props {
	className?: string
	users: User[]
}

export const SheetUsers: React.FC<Props> = ({ className, users }) => {
	return (
		<div className={cn('rounded-xl shadow-xl bg-background', className)}>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-4' />
						<TableHead>Пользователь</TableHead>
						<TableHead>Статус</TableHead>
						<TableHead className='w-auto'>email</TableHead>
						<TableHead className='w-auto'>телефон</TableHead>
						<TableHead className='w-[230px]'>дата регистрации</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users &&
						users
							?.sort((a: User, b: User) => a.id - b.id)
							.map((user: User, index: number) => (
								<TableRow key={index}>
									<TableCell className='p-0 pl-2'>
										<Avatar className='w-8 h-8'>
											<AvatarImage
												src={user.image || '/logo_black.svg'}
												alt='avatar'
											/>
											<AvatarFallback>GS</AvatarFallback>
										</Avatar>
									</TableCell>
									<TableCell className='text-left'>
										{user.fullName || 'Не указано'}
									</TableCell>
									<TableCell className='p-0'>
										<Badge
											variant={
												user.role === 'ADMIN'
													? 'destructive'
													: user.role === 'MODER'
													? 'default'
													: 'secondary'
											}
										>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>{user.email || 'Не указано'}</TableCell>
									<TableCell>{user.phoneNumber || 'Не указано'}</TableCell>
									<TableCell>
										{user.createdAt.toLocaleString('ru', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</TableCell>
								</TableRow>
							))}
				</TableBody>
			</Table>
		</div>
	)
}
