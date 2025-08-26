import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const openInNewTab = (url: string) => {
	const newWindow = window.open(url, '_blank');
	if (newWindow) newWindow.opener = null;
};
