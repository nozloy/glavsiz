import { Banners } from '@/components/shared/dashboard/banners'
import { Check } from '@/components/shared/dashboard/check'
import { TopSelelrs } from '@/components/shared/dashboard/top-selelrs'
import { Users } from '@/components/shared/dashboard/users'

export const dynamic = 'force-dynamic'

export interface GetDashboardParams {
	mode?: string
}
export default async function Page({
	searchParams,
}: {
	searchParams: GetDashboardParams
}) {
	const mode = searchParams?.mode ? searchParams.mode : ''
	const isUsers = mode === 'users'
	const isBanners = mode === 'banners'
	const isTopSelelrs = mode === 'top-sellers'
	if (isUsers) {
		return (
			<div className='bg-secondary min-h-screen'>
				<Users />
			</div>
		)
	}
	if (isBanners) {
		return (
			<div className='bg-secondary min-h-screen'>
				<Banners />
			</div>
		)
	}
	if (isTopSelelrs) {
		return (
			<div className='bg-secondary min-h-screen'>
				<TopSelelrs />
			</div>
		)
	}
	return (
		<div className='bg-secondary min-h-screen'>
			<Check />
		</div>
	)
}
