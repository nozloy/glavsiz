'use server'
import axios from 'axios'

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || '',
	timeout: 5000,
	headers: { 'Content-Type': 'application/json' },
})

export default apiClient
