import clsx from 'clsx'
import React from 'react'

/**
 * Определяет возможные размеры заголовка.
 * @typedef {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} TitleSize
 */
type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Свойства компонента Title.
 * @typedef {Object} Props
 * @property {TitleSize} [size] - Размер заголовка. По умолчанию 'sm'.
 * @property {string} [className] - Дополнительный класс CSS.
 * @property {string} text - Текст заголовка.
 */
interface Props {
	size?: TitleSize
	className?: string
	text: string
}

/**
 * Компонент для отображения заголовка с различными размерами и стилями.
 *
 * @param {Props} props - Свойства компонента.
 * @param {string} props.text - Текст заголовка.
 * @param {TitleSize} [props.size='sm'] - Размер заголовка. По умолчанию 'sm'. Может быть xs sm md lg xl 2xl.
 * @param {string} [props.className] - Дополнительный класс CSS.
 * @returns {JSX.Element} JSX элемент заголовка.
 */
export const Title: React.FC<Props> = ({ text, size = 'sm', className }) => {
	const mapTagBySize = {
		xs: 'h5',
		sm: 'h4',
		md: 'h3',
		lg: 'h2',
		xl: 'h1',
		'2xl': 'h1',
	} as const

	const mapClassNameBySize = {
		xs: 'text-[16px]',
		sm: 'text-[22px]',
		md: 'text-[26px]',
		lg: 'text-[32px]',
		xl: 'text-[40px]',
		'2xl': 'text-[48px]',
	} as const

	return React.createElement(
		mapTagBySize[size],
		{ className: clsx(mapClassNameBySize[size], className) },
		text,
	)
}
