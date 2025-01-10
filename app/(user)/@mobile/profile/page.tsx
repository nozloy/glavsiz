import { prisma } from '@/prisma/prisma-client'
import { getUserSession } from '@/lib/get-session'
import { SignOutButton } from '@/components/shared/sign-out-button'
import Image from 'next/image'

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
		<div className='flex flex-row items-center justify-center h-full w-full my-auto'>
			<div className=' rounded-lg p-4 pt-6 flex flex-col gap-1 items-center justify-center shadow-md text-muted-foreground text-lg'>
				<Image
					width={80}
					height={80}
					quality={100}
					className='rounded-full w-20 shadow-md shadow-black'
					src={user.image!}
					alt={'avatar'}
				></Image>

				<p className='text-foreground font-bold text-2xl pt-2'>
					{user.fullName}
				</p>
				<p>{user.phoneNumber}</p>
				<p>{user.email}</p>
				<p>{verifiedDate}</p>
				<p>Аккаунт: {user.provider}</p>
				<SignOutButton className='w-full' />
			</div>
		</div>
	)
}
