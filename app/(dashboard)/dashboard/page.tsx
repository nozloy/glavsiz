import { Check } from '@/components/shared/check'

export const dynamic = 'force-dynamic'

export default async function Page() {
	return (
		<div className='bg-secondary min-h-screen'>
			<Check />
		</div>
	)
}
