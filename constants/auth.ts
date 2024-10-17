import { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import YandexProvider from 'next-auth/providers/yandex'
import VkProvider from 'next-auth/providers/vk'
import { prisma } from '@/prisma/prisma-client'
import { hashSync } from 'bcrypt'
import { Role as UserRole } from '@prisma/client'

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		YandexProvider({
			clientId: process.env.YANDEX_CLIENT_ID || '',
			clientSecret: process.env.YANDEX_CLIENT_SECRET || '',
			profile(profile) {
				console.log('Yandex OAuth Profile Response:', profile)
				return {
					id: profile.id,
					name: profile.real_name,
					email: profile.default_email,
					image: `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-68`,
					role: 'USER' as UserRole,
				}
			},
		}),
		VkProvider({
			clientId: process.env.VK_CLIENT_ID || '',
			clientSecret: process.env.VK_CLIENT_SECRET || '',
			authorization: {
				params: {
					scope: 'email',
				},
			},

			profile(profile, user) {
				console.log(
					'VK OAuth Full Profile Response:',
					JSON.stringify(profile, null, 2),
				)
				const vkProfile = profile?.response?.[0]
				return {
					id: String(vkProfile.id),
					name: `${vkProfile.first_name} ${vkProfile.last_name}`,
					email: user.email ? String(user.email) : null,
					image: vkProfile.photo_100,
					role: 'USER' as UserRole,
				}
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			try {
				if (!user.email) {
					return false
				}

				const findUser = await prisma.user.findFirst({
					where: {
						OR: [
							{
								provider: account?.provider,
								providerId: account?.providerAccountId,
							},
							{ email: user.email },
						],
					},
				})

				if (findUser) {
					await prisma.user.update({
						where: {
							id: findUser.id,
						},
						data: {
							provider: account?.provider,
							providerId: account?.providerAccountId,
						},
					})

					return true
				}
				await prisma.user.create({
					data: {
						email: user.email,
						fullName: user.name || 'User #' + user.id,
						password: hashSync(user.id.toString(), 10),
						verified: new Date(),
						image: user.image,
						provider: account?.provider,
						providerId: account?.providerAccountId,
					},
				})

				return true
			} catch (error) {
				console.error('Error [SIGNIN]', error)
				return false
			}
		},
		async jwt({ token }) {
			if (!token.email) {
				return token
			}

			const findUser = await prisma.user.findFirst({
				where: {
					email: token.email,
				},
			})

			if (findUser) {
				token.id = String(findUser.id)
				token.email = findUser.email
				token.fullName = findUser.fullName
				token.role = findUser.role
			}

			return token
		},
		session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id
				session.user.role = token.role
			}

			return session
		},
	},
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
