'use server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'

const s3 = new S3Client({
	region: 'ru1',
	endpoint: 'https://s3.ru1.storage.beget.cloud',
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME!
const BASE_URL = 'https://cdn.glavsiz.ru/'

// Функция для загрузки одного файла в S3
async function uploadFile(filePath: string, relativePath: string) {
	const fileName = path.basename(filePath) // Извлекаем имя файла
	const fileKey = `images/${relativePath}` // Путь для хранения файла в S3, сохраняем структуру папок

	// Чтение файла как потока
	const fileStream = fs.createReadStream(filePath)

	// Создание команды для загрузки
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: fileKey, // Указываем путь с учетом подпапок
		Body: fileStream, // Загружаем файл как поток
		ContentType: getContentType(fileName), // MIME тип
	})

	try {
		await s3.send(command) // Загрузка в S3
		console.log(`Файл ${fileName} успешно загружен!`)

		// Формируем публичный URL для файла
		const fileUrl = `${BASE_URL}${fileKey}`
		return fileUrl
	} catch (err) {
		console.error('Ошибка при загрузке файла: ', err)
		throw new Error('Ошибка загрузки файла')
	}
}

// Функция для получения MIME типа файла
function getContentType(fileName: string): string {
	const ext = path.extname(fileName).toLowerCase()
	switch (ext) {
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg'
		case '.png':
			return 'image/png'
		default:
			return 'application/octet-stream'
	}
}

// Пакетная загрузка изображений из папки
export async function uploadExtractedImagesBatch(
	extractDir: string,
	batchSize = 10,
) {
	const files = await fsPromises.readdir(extractDir, { withFileTypes: true })
	const tasks: Promise<string>[] = [] // Список задач для загрузки

	for (const file of files) {
		const filePath = path.join(extractDir, file.name)

		if (file.isDirectory()) {
			// Рекурсивно загружаем файлы из подпапок
			await uploadExtractedImagesBatch(filePath, batchSize)
		} else if (
			file.name.endsWith('.jpg') ||
			file.name.endsWith('.png') ||
			file.name.endsWith('.jpeg')
		) {
			// Добавляем задачу загрузки в массив
			const relativePath = path.relative(extractDir, filePath)
			tasks.push(uploadFile(filePath, relativePath))

			// Если задач больше batchSize, ждем завершения текущей партии
			if (tasks.length >= batchSize) {
				await Promise.all(tasks)
				tasks.length = 0 // Очищаем массив задач
			}
		}
	}

	// Загружаем оставшиеся файлы
	if (tasks.length > 0) {
		await Promise.all(tasks)
	}
}
