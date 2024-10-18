import { prisma } from './prisma-client'
import { Role } from '@prisma/client'
export default async function constants() {
	// Создаем города
	const ufa = await prisma.city.upsert({
		where: { name: 'Уфа' },
		update: {},
		create: { name: 'Уфа' },
	})

	const kazan = await prisma.city.upsert({
		where: { name: 'Казань' },
		update: {},
		create: { name: 'Казань' },
	})

	const ekaterinburg = await prisma.city.upsert({
		where: { name: 'Екатеринбург' },
		update: {},
		create: { name: 'Екатеринбург' },
	})

	// Создаем адреса и привязываем их к городам
	const address1 = await prisma.address.create({
		data: {
			name: 'Кольцевая ул., 56',
			url1: '',
			city: { connect: { id: ufa.id } },
		},
	})

	const address2 = await prisma.address.create({
		data: {
			name: 'Индустриальное ш., 112/1',
			url1: '',
			city: { connect: { id: ufa.id } },
		},
	})

	const address3 = await prisma.address.create({
		data: {
			name: 'ул. Демьяна Бедного, 7',
			url1: '',
			city: { connect: { id: ufa.id } },
		},
	})

	const address4 = await prisma.address.create({
		data: {
			name: 'ул. Журналистов, 56А',
			url1: '',
			city: { connect: { id: kazan.id } },
		},
	})

	const address5 = await prisma.address.create({
		data: {
			name: 'ул. Восстания, 100, корп. 9160',
			url1: '',
			city: { connect: { id: kazan.id } },
		},
	})

	const address6 = await prisma.address.create({
		data: {
			name: 'ул. Декабристов, 6',
			url1: '',
			city: { connect: { id: ekaterinburg.id } },
		},
	})

	// Создаем контакты и привязываем их к городам и адресам
	const contact1 = await prisma.contact.create({
		data: {
			one: '+7 (905) 180-95-38',
			city: { connect: { id: ufa.id } },
			addresses: { connect: { id: address1.id } },
		},
	})

	const contact2 = await prisma.contact.create({
		data: {
			one: '+7 (961) 364-61-43',
			city: { connect: { id: ufa.id } },
			addresses: { connect: { id: address2.id } },
		},
	})

	const contact3 = await prisma.contact.create({
		data: {
			one: '+7 (964) 953-42-03',
			city: { connect: { id: ufa.id } },
			addresses: { connect: { id: address3.id } },
		},
	})

	const contact4 = await prisma.contact.create({
		data: {
			one: '+7 (347) 258-90-08',
			city: { connect: { id: ufa.id } },
		},
	})

	const contact5 = await prisma.contact.create({
		data: {
			one: '+7 (965) 617-23-80',
			city: { connect: { id: kazan.id } },
			addresses: { connect: { id: address4.id } },
		},
	})

	const contact6 = await prisma.contact.create({
		data: {
			one: '+7 (967) 461-28-70',
			city: { connect: { id: kazan.id } },
			addresses: { connect: { id: address5.id } },
		},
	})

	const contact7 = await prisma.contact.create({
		data: {
			one: '+7 (962) 388-00-76',
			city: { connect: { id: ekaterinburg.id } },
			addresses: { connect: { id: address6.id } },
		},
	})
	console.log('Города, адреса и контакты созданы.')
}
