import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import AppProvider from '@/providers';

const poppins = Poppins({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-poppins',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Staff',
	description: 'Sistema de Staff Sou da Liga',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-br"
			suppressHydrationWarning
			className={`${poppins.className} antialiased`}
		>
			<body>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
