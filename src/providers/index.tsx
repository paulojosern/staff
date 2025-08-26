'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { AuthProvider } from './useAuth';
import { ReactNode } from 'react';
import { ThemeApp } from './themeProvider';
import { CorporationProvider } from './useCorporation';
import { Toaster } from '@/components/ui/sonner';
import { ProgressProvider } from '@bprogress/next/app';

type PropAppProvider = {
	children: ReactNode;
};

const AppProvider = ({ children }: PropAppProvider) => (
	<ThemeApp
		attribute="class"
		defaultTheme="system"
		enableSystem
		disableTransitionOnChange
	>
		<ThemeProvider theme={theme}>
			<AuthProvider>
				<CorporationProvider>
					<ProgressProvider
						height="4px"
						color="#d76d11"
						options={{ showSpinner: false }}
						shallowRouting
					>
						{children}
					</ProgressProvider>
					<Toaster position="top-right" visibleToasts={1} />
				</CorporationProvider>
			</AuthProvider>
		</ThemeProvider>
	</ThemeApp>
);

export default AppProvider;
