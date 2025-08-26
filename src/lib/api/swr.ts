'use client';

import useSWR, { SWRResponse } from 'swr';
import api from './axios';
import { useAuth } from '@/providers/useAuth';

export default function useFetch<T>(url: string): SWRResponse<T> {
	const { logout } = useAuth();

	return useSWR<T>(url, async (url: string): Promise<T> => {
		try {
			const response = await api.get<T>(url);
			return response.data;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: unknown | any) {
			if (error.response?.status === 404) {
				throw new Error('Not found');
			} else if (error.response?.status === 401) {
				logout();
				throw new Error('Unauthorized');
			}
			throw new Error(error.message || 'Failed to fetch data');
		}
	});
}
