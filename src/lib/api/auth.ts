import api from './axios';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { constants } from '../constants';
import { jwtDecode } from 'jwt-decode';
import { DataCorporation } from '@/providers/useCorporation';

export interface TypeDecode {
	exp: number;
	iat: number;
	nbf: number;
	role: string;
	unique_name: string;
	usuarioID: string;
	pessoaID: string;
	corporacaoID: string;
}

export const authService = {
	async signIn(email: string, password: string, guid: string) {
		const response = await api.post('/api/Security/StaffAuth', {
			login: email,
			senha: password,
			guid,
		});

		if (response.data.accessToken) {
			const { accessToken, tipousuarioStaff, produtorId, prestadorId } =
				response.data;
			setCookie(constants.TOKEN_COOKIE + guid, accessToken);
			setCookie(constants.GUID_COOKIE, guid);
			setCookie(
				constants.STAFF_USER_COOKIE,
				`${tipousuarioStaff}__${produtorId | 0}__${prestadorId | 0}`
			);
		}

		return response.data;
	},

	async signInMFA(login: string, code: string, guid: string) {
		const response = await api.post('api/Security/UserAuth/PostMFA/', {
			login,
			code,
			guid,
			interface: 'B2B',
		});

		if (response.data.accessToken) {
			setCookie(constants.TOKEN_COOKIE + guid, response.data.accessToken);
			setCookie(constants.GUID_COOKIE, guid);
		}

		return response.data;
	},

	async getCurrentUser() {
		const guid = getCookie(constants.GUID_COOKIE) as string;
		const token = getCookie(constants.TOKEN_COOKIE + guid) as string;
		const staff_user = getCookie(constants.STAFF_USER_COOKIE) as string;
		const [tipousuarioStaff, produtorId, prestadorId] = staff_user?.split('__');

		if (token) {
			const { usuarioID, role, corporacaoID } = jwtDecode<TypeDecode>(token);
			const response = await api.get(
				`/api/Usuario/Get?UsuarioID=${usuarioID}&CorporacaoGuid=${guid}`
			);
			return {
				...response.data,
				guid,
				corporacaoID,
				tipousuario: role,
				accessToken: token,
				tipousuarioStaff,
				produtorId,
				prestadorId,
			};
		}
	},

	async getCorporations(login: string) {
		if (login) {
			const response = await api.get<DataCorporation[]>(
				`api/Usuario/ListCorporacoes?Login=${login}`
			);
			if (response) {
				return response.data;
			}

			return [];
		}
	},

	logout() {
		const guid = getCookie(constants.GUID_COOKIE) as string;
		deleteCookie(constants.TOKEN_COOKIE + guid);
		deleteCookie(constants.GUID_COOKIE);
		window.location.href = '/login';
	},

	isAuthenticated() {
		const guid = getCookie(constants.GUID_COOKIE) as string;
		return !!getCookie(constants.TOKEN_COOKIE + guid);
	},
};
