import {
	Users,
	ListChecks,
	Images,
	ListStart,
	NotebookTabs,
} from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from '@/components/ui/sidebar'
import { getUserSession } from '@/lib/get-session'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '../../ui/badge'

// Menu items.
const items = [
	{
		title: 'Все товары',
		url: '/dashboard',
		icon: ListChecks,
	},
	{
		title: 'Пользователи',
		url: '/dashboard?mode=users',
		icon: Users,
	},
	{
		title: 'Баннеры',
		url: '/dashboard?mode=banners',
		icon: Images,
	},
	{
		title: 'Топ продаж',
		url: '/dashboard?mode=top-sellers',
		icon: ListStart,
	},
	{
		title: 'Контакты',
		url: '/dashboard?mode=contacts',
		icon: NotebookTabs,
	},
]

export async function AppSidebar() {
	const user = await getUserSession()
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>GLAVSIZ.RU</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span className='text-black'>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<Link
					className='flex flex-row gap-2 items-center justify-start bg-secondary rounded-xl p-3 select-none cursor-pointer'
					href={'/profile'}
					target='_blank'
				>
					<Image
						width={42}
						height={42}
						src={user?.image || './logo_black.svg'}
						alt='avatar'
						className='rounded-full'
					/>
					<div className='flex flex-col'>
						<p className='text-[12px] font-bold'>{user?.name}</p>
						<Badge
							className='flex items-center justify-center w-[60px] text-[10px]'
							variant={
								user?.role === 'ADMIN'
									? 'destructive'
									: user?.role === 'MODER'
									? 'default'
									: 'secondary'
							}
						>
							{user?.role}
						</Badge>
					</div>
				</Link>
			</SidebarFooter>
		</Sidebar>
	)
}
