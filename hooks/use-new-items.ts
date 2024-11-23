'use client'

import { useState, useEffect } from 'react'
import { fetchNewItems } from '@/lib/find-items'

export function useNewItems(count: number) {
	const [items, setItems] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function loadItems() {
			try {
				const data = await fetchNewItems(count)
				setItems(data)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		loadItems()
	}, [count])

	return { items, loading, error }
}
