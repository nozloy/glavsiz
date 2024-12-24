/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect } from 'react'
const ID = process.env.NEXT_PUBLIC_YANDEX_METRICA

const Metrica = () => {
	useEffect(() => {
		;(function (m, e, t, r, i, k, a) {
			m[i] =
				m[i] ||
				function () {
					;(m[i].a = m[i].a || []).push(arguments)
				}
			m[i].l = 1 * new Date()
			for (let j = 0; j < document.scripts.length; j++) {
				if (document.scripts[j].src === r) return
			}
			k = e.createElement(t)
			a = e.getElementsByTagName(t)[0]
			k.async = 1
			k.src = r
			a.parentNode.insertBefore(k, a)
		})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

		// Инициализация Метрики
		window.ym?.(ID, 'init', {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: true,
			ecommerce: 'dataLayer',
		})
	}, [])

	return (
		<noscript>
			<div>
				<img
					src={`https://mc.yandex.ru/watch/${ID}`}
					style={{ position: 'absolute', left: '-9999px' }}
					alt=''
				/>
			</div>
		</noscript>
	)
}

export default Metrica
