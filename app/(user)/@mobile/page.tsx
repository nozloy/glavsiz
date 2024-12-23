import { MobileVersion } from '@/components/shared/mobile-version'
import { MobileChooseCity } from '@/components/shared/mobile/mobile-choose-city'
import { MobileHeader } from '@/components/shared/mobile/mobile-header'

export const dynamic = 'force-dynamic'

export default async function Mobile() {
	return (
		<div className='flex flex-col items-center justify-center relative'>
			<MobileHeader />
			<div className='w-full flex items-center justify-end mr-8'>
				<MobileChooseCity />
			</div>
			<MobileVersion />
		</div>
	)
}
