'use client'
import React from 'react'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<React.Fragment>
			<SessionProvider>{children}</SessionProvider>
			<Toaster />
		</React.Fragment>
	)
}
