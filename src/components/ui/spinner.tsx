'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface SpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
	const { theme } = useTheme();
	const isDarkMode = theme === 'dark';

	// Size mappings
	const sizeMap = {
		sm: 'h-4 w-4 border-2',
		md: 'h-8 w-8 border-3',
		lg: 'h-12 w-12 border-4',
	};

	return (
		<div className={`flex items-center justify-center ${className}`} >
			<motion.div
				className={`rounded-full ${
					sizeMap[size]
				} border-solid border-t-transparent ${
					isDarkMode ? 'border-white/80' : 'border-gray-800'
				}`}
				animate={{ rotate: 360 }}
				transition={{
					duration: 1,
					ease: 'linear',
					repeat: Number.POSITIVE_INFINITY,
				}}
			/>
		</div>
	);
}
