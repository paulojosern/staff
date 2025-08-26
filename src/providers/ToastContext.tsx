import React, {
	createContext,
	useCallback,
	useState,
	useContext,
	ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import ToastConatiner from '@/components/elements/Toast';

export interface ToastMessage {
	id: string;
	type?: 'success' | 'error' | 'info' | 'warning';
	title: string;
	description?: string;
}

interface ToastContextData {
	addToast(message: Omit<ToastMessage, 'id'>): void;
	clearToast(): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

type PropsProvider = {
	children: ReactNode;
};

const ToastProvider = ({ children }: PropsProvider) => {
	const [message, setMessage] = useState<ToastMessage | null>(null);

	const addToast = useCallback(
		({ type, title, description }: Omit<ToastMessage, 'id'>) => {
			const id = uuidv4();

			const toast = {
				id,
				type,
				title,
				description,
			};

			setMessage(toast);
		},
		[]
	);

	const clearToast = useCallback(() => {
		setMessage(null);
	}, []);

	return (
		<ToastContext.Provider value={{ addToast, clearToast }}>
			<ToastConatiner message={message} />
			{children}
		</ToastContext.Provider>
	);
};

function useToast(): ToastContextData {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}

	return context;
}

export { useToast, ToastProvider };
