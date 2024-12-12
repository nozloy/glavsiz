import React from 'react'
import { cn } from '@/lib/utils'
import { SheetUsers } from './sheet-users'
import { allUsers } from '@/lib/find-users'
import { getRoleOrUnauthorized, getUserSession } from '@/lib/get-session'
import { prisma } from '@/prisma/prisma-client'
import { Role, User } from '@prisma/client'

interface Props {
	className?: string
}

export const Users: React.FC<Props> = async ({ className }) => {
	let users: User[] = []
	const role = await getRoleOrUnauthorized()
	if (role === Role.MODER) {
		users = await allUsers('moder')
	} else if (role === Role.ADMIN) {
		users = await allUsers('admin')
	}

	return (
		<div className={cn('p-4', className)}>
			<SheetUsers users={users} />
		</div>
	)
}
