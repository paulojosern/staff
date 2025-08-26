import styled, { css } from 'styled-components';
import { animated } from '@react-spring/web';
import { theme } from '@/styles/theme';
// import media from 'styled-media-query'
// import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

interface ToastProps {
	type?: 'success' | 'info' | 'error' | 'warning';
}

const toastTypes = {
	info: css`
		background: ${theme.colors.lightGray};
		color: ${theme.colors.text};
	`,
	success: css`
		background: #3485ff;
		color: #fff;
	`,
	error: css`
		background: ${theme.colors.error};
		color: ${theme.colors.white};
	`,
	warning: css`
		background: #ffd452;
		color: ${theme.colors.black};
	`,
};

export const Container = styled(animated.div)<ToastProps>`
	width: 400px;
	position: relative;
	padding: 20px 30px 20px 20px;
	border-radius: 10px;
	/* box-shadow: 0 3px 14px 7px rgba(0, 0, 0, 0.05); */

	display: flex;

	& + div {
		margin-top: 10px;
	}

	${(props) => toastTypes[props.type || 'info']}

	> svg {
		margin: 4px 12px 0 0;
	}

	div {
		flex: 1;
		p {
			margin-top: 4px;
			font-size: 14px;
			opacity: 0.8;
			line-height: 20px;
		}
	}
	.text {
		font-weight: 600;
	}

	button {
		position: absolute;
		right: 15px;
		top: 15px;
		border: 0px;
		background: transparent;
		color: inherit;
	}
`;
