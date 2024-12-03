'use client'

import { useState, useEffect } from 'react'
import { fetchBestItems } from '@/lib/find-items'

export function useBestItems() {
	const [items, setItems] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function loadItems() {
			try {
				const data = await fetchBestItems()
				setItems(data)
			} catch (err: any) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		loadItems()
	}, [])

	return { items, loading, error }
}
