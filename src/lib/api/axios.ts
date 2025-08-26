import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';
import { constants } from '../constants';

const api = axios.create({
	baseURL: constants.API_BASE_URL,
});

api.interceptors.request.use((config) => {
	const guid = getCookie(constants.GUID_COOKIE) as string;
	const token = getCookie(constants.TOKEN_COOKIE + guid) as string;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			deleteCookie(constants.TOKEN_COOKIE);
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api;
