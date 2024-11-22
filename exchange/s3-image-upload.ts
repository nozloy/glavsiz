import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'
import cliProgress from 'cli-progress'

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
async function uploadFile(
	filePath: string,
	relativePath: string,
	progressBar: cliProgress.SingleBar,
) {
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
		progressBar.increment() // Обновление прогресса

		// Формируем публичный URL для файла
		const fileUrl = `${BASE_URL}${fileKey}`
		return fileUrl
	} catch (err) {
		console.error(`Ошибка при загрузке файла ${fileName}:`, err)
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

// Загрузка всех изображений после разархивирования
export async function uploadExtractedImages(extractDir: string) {
	const files = await collectFiles(extractDir) // Собираем все файлы

	const progressBar = new cliProgress.SingleBar(
		{
			format:
				'Загрузка изображений | {bar} | {percentage}% | {value}/{total} файлов',
		},
		cliProgress.Presets.shades_classic,
	)
	progressBar.start(files.length, 0) // Инициализируем прогресс-бар

	for (const file of files) {
		const filePath = path.join(extractDir, file)
		const relativePath = file // Используем относительный путь от extractDir
		await uploadFile(filePath, relativePath, progressBar)
	}

	progressBar.stop() // Останавливаем прогресс-бар
	console.log('Все изображения успешно загружены!')
}

// Рекурсивная функция для сбора всех файлов изображений
async function collectFiles(directory: string): Promise<string[]> {
	const entries = await fsPromises.readdir(directory, { withFileTypes: true })
	const files: string[] = []

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name)
		if (entry.isDirectory()) {
			// Рекурсивно собираем файлы из вложенных папок
			const nestedFiles = await collectFiles(fullPath)
			files.push(...nestedFiles.map(file => path.relative(directory, file)))
		} else if (entry.name.endsWith('.jpg') || entry.name.endsWith('.png')) {
			files.push(path.relative(directory, fullPath))
		}
	}

	return files
}
