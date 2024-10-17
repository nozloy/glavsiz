import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'
import type { UserRole } from '@prisma/client'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: UserRole
			name: string
			image: string
		} & DefaultSession['user']
	}

	interface User extends DefaultUser {
		id: string // Change id to string for consistency
		role: UserRole
		phone: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id: string
		role: UserRole
	}
}
