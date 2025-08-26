'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { GlobalStyle } from '@/styles/globalStyle';

export default function StyledComponentsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return (
			<>
				<GlobalStyle />
				{styles}
			</>
		);
	});

	if (typeof window !== 'undefined') {
		return (
			<>
				<GlobalStyle />
				{children}
			</>
		);
	}

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			<GlobalStyle />
			{children}
		</StyleSheetManager>
	);
}
