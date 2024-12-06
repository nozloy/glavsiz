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
} from '@/components/ui/sidebar'

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

export function AppSidebar() {
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
		</Sidebar>
	)
}
