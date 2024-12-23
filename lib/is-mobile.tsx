export function isMobile(userAgent: string): boolean {
	return /iPhone|iPad|iPod|Android/i.test(userAgent)
}
