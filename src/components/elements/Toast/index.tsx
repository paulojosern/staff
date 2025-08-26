/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react';
import { ToastMessage } from '@/providers/ToastContext';
import Toast from './Toast-item';
import { useTransition, animated } from '@react-spring/web';
import * as S from './styles';
interface ToastContainerProps {
	message: ToastMessage | null;
}

const ToastConatiner: React.FC<ToastContainerProps> = ({
	message,
}: ToastContainerProps) => {
	const transitions = useTransition(message, {
		from: { transform: 'translate3d(100%,0,0)', opacity: 0 },
		enter: { transform: 'translate3d(0%,0,0)', opacity: 1 },
		leave: { transform: 'translate3d(100%,0,0)', opacity: 0 },
	});

	return transitions((style, item) => (
		<animated.div style={style}>
			<S.Container>
				<Toast message={item} />
			</S.Container>
		</animated.div>
	));
};

export default ToastConatiner;
