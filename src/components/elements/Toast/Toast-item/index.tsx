/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect } from 'react';
import {
	FiAlertCircle,
	FiX,
	FiInfo,
	FiCheckCircle,
	FiAlertTriangle,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '@/providers/ToastContext';
import * as S from './styles';

interface ToastProps {
	message: ToastMessage;
}

const icons = {
	info: <FiInfo size={20} />,
	warning: <FiAlertTriangle size={20} />,
	error: <FiAlertCircle size={20} />,
	success: <FiCheckCircle size={20} />,
};

const Toast = ({ message }: ToastProps) => {
	const { clearToast } = useToast();

	useEffect(() => {
		const timer = setTimeout(() => {
			clearToast();
		}, 15000);

		return () => {
			clearTimeout(timer);
		};
	}, [clearToast]);

	return (
		message && (
			<S.Container type={message?.type}>
				{icons[message?.type || 'info']}
				<article>
					<header>{message.title}:</header>
					{message.description && <span>{message.description}</span>}
				</article>
				<button type="button" onClick={() => clearToast()}>
					<FiX size={18} />
				</button>
			</S.Container>
		)
	);
};

export default Toast;
