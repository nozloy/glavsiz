import xml2js from 'xml2js'
import axios from 'axios'
import { env } from 'process'
import { Season } from '@prisma/client'

/**
 * Функция для получения и обработки данных из фида.
 */
export default async function fetchFeed() {
	try {
		// Получаем данные из URL
		const { data } = await axios.get(env.NEXT_PUBLIC_FEED_URL as string)

		// Преобразуем XML в JSON
		const parsedData = await xml2js.parseStringPromise(data, {
			explicitArray: false,
		})

		// Получаем список категорий
		const categories = parsedData?.yml_catalog?.shop?.categories?.category || []

		// Получаем предложения (offers)
		const offers = parsedData?.yml_catalog?.shop?.offers?.offer || []

		// Преобразуем данные для удобства работы
		const items = offers.map((offer: any) => {
			// Найдем категорию по `categoryId`
			const category = categories.find(
				(category: any) => category.$.id === offer.categoryId,
			)
			const categoryId = parseInt(category?.$.id)
			const categoryName = category?._ || 'Без категории'
			const parentCategoryId = parseInt(category?.$.parentId)

			return {
				id: offer.$.id,
				vendorCode: offer.vendorCode,
				count: offer.count
					? parseInt(offer.count)
					: parseInt(offer.outlets?.[0]?.instock || 0),
				name: offer.name,
				size:
					offer.param && Array.isArray(offer.param)
						? offer.param.find(
								(p: any) => p.$.name === 'Наименование для выгрузки',
						  )?._
						: undefined,
				price: parseInt(offer.price),
				images: offer.picture ? [offer.picture] : [], // Если есть картинка, добавим в массив
				categoryId: categoryId,
				categoryName: categoryName,
				parentCategoryId: parentCategoryId,
				description: offer.description
					? offer.description
							.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
							.replace(/<[^>]+>/g, '') // Убираем HTML-теги
							.trim() // Удаляем лишние пробелы
					: '', // Если нет описания, назначаем пустую строку
				materials:
					offer.param && Array.isArray(offer.param)
						? offer.param.find((p: any) =>
								p.$.name.toLowerCase().includes('материал'),
						  )?._ || '' // Ищем первый материал
						: '',
				season: offer.name.toLowerCase().includes('зим') //если в названии есть корень зим
					? Season.Winter // то сезон летний
					: offer.name.toLowerCase().includes('лет') //если в названии есть корень лет
					? Season.Summer // то сезон зимний
					: null,
				color:
					offer.param && Array.isArray(offer.param)
						? offer.param.find((p: any) =>
								p.$.name.toLowerCase().includes('цвет'),
						  )?._ // Ищем цвет
						: undefined,
				brand:
					offer.param && Array.isArray(offer.param)
						? offer.param.find((p: any) =>
								p.$.name.toLowerCase().includes('бренд'),
						  )?._ // Ищем бренд
						: undefined,
				materialLiner:
					offer.param && Array.isArray(offer.param)
						? offer.param.find((p: any) =>
								p.$.name.toLowerCase().includes('подкладка'),
						  )?._ // Ищем подкладка
						: undefined,
				materialInsulation:
					offer.param && Array.isArray(offer.param)
						? offer.param.find((p: any) =>
								p.$.name.toLowerCase().includes('утеплитель'),
						  )?._ // Ищем утеплитель
						: undefined,
			}
		})

		console.log('Данные успешно получены и обработаны.') // Сообщение об успехе
		return { items, categories }
	} catch (error) {
		console.error('Ошибка при получении выгрузки:', error) // Сообщение об ошибке
		return null
	}
}
