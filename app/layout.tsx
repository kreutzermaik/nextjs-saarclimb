import type {Metadata} from 'next';
import '@/app/shared/style/globals.css';
import ReduxProvider from './ReduxProvider';

export const metadata: Metadata = {
    title: 'SaarClimb',
    description: 'Die App für Boulderer im Saarland',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <html lang="de">
            <body suppressHydrationWarning={true}>{children}</body>
            </html>
        </ReduxProvider>
    )
}
