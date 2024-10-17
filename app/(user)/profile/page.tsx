import { prisma } from '@/prisma/prisma-client'
import { getUserSession } from '@/lib/get-session'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { Container } from '@/components/shared'

export default async function ProfilePage() {
	const session = await getUserSession()

	if (!session?.id) {
		return <div>Вы не авторизованы</div>
	}

	const user = await prisma.user.findFirst({
		where: { id: Number(session.id) },
	})

	if (!user) {
		return <div>Вы не авторизованы</div>
	}

	const verifiedDate = String(
		user.verified
			? user.verified.toLocaleString('ru', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
			  })
			: 'not verified',
	)
	return (
		<Container>
			<div className='border-2 border-primary rounded-lg p-4 flex flex-col gap-2 items-center justify-center shadow-md shadow-primary text-primary-foreground'>
				<img
					className='rounded-full w-40 shadow-sm shadow-black'
					src={user.image!}
				></img>
				{user.fullName}
				<br />
				Phone Number: {user.phoneNumber}
				<br />
				email: {user.email}
				<br />
				Статус: {user.role}
				<br />
				ID: {user.id}
				<br />
				Verified: {verifiedDate}
				<br />
				Provider: {user.provider}
				<SignOutButton className='w-full' />
			</div>
		</Container>
	)
}
