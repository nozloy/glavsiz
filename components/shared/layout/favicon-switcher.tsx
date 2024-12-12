'use client'

import { useEffect } from 'react'

const FaviconSwitcher = () => {
	useEffect(() => {
		const updateFavicon = (isDark: boolean) => {
			const favicon = document.querySelector("link[rel='icon']")
			if (favicon) {
				favicon.setAttribute('href', isDark ? '/icon.svg' : '/icon2.svg')
			}
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		// Установить начальную тему
		updateFavicon(mediaQuery.matches)

		// Обработчик изменений темы
		const handleChange = (e: MediaQueryListEvent) => {
			updateFavicon(e.matches)
		}

		mediaQuery.addEventListener('change', handleChange)

		return () => {
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	return null // Этот компонент не рендерит ничего
}

export default FaviconSwitcher
