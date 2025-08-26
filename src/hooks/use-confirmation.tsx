'use client';

import { useState, useCallback } from 'react';

type ConfirmationDialogOptions = {
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
};

type ConfirmationDialogHook = {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText: string;
	cancelText: string;
	confirm: () => void;
	cancel: () => void;
	openConfirmation: (options?: ConfirmationDialogOptions) => Promise<boolean>;
};

export function useConfirmationDialog(): ConfirmationDialogHook {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState('Confirmação');
	const [message, setMessage] = useState('Tem certeza que deseja continuar?');
	const [confirmText, setConfirmText] = useState('Sim');
	const [cancelText, setCancelText] = useState('Não');

	const [resolvePromise, setResolvePromise] =
		useState<(value: boolean) => void>();
	const [rejectPromise, setRejectPromise] =
		useState<(reason?: unknown) => void>();

	const confirm = useCallback(() => {
		setIsOpen(false);
		if (resolvePromise) {
			resolvePromise(true);
		}
	}, [resolvePromise]);

	const cancel = useCallback(() => {
		setIsOpen(false);
		if (rejectPromise) {
			rejectPromise(new Error('User cancelled the action'));
		}
	}, [rejectPromise]);

	const openConfirmation = useCallback(
		(options?: ConfirmationDialogOptions): Promise<boolean> => {
			setIsOpen(true);

			if (options?.title) setTitle(options.title);
			if (options?.message) setMessage(options.message);
			if (options?.confirmText) setConfirmText(options.confirmText);
			if (options?.cancelText) setCancelText(options.cancelText);

			return new Promise<boolean>((resolve, reject) => {
				setResolvePromise(() => resolve);
				setRejectPromise(() => reject);
			});
		},
		[]
	);

	return {
		isOpen,
		title,
		message,
		confirmText,
		cancelText,
		confirm,
		cancel,
		openConfirmation,
	};
}
