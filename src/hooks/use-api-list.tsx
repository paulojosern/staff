'use client';
import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api/axios';
import { AxiosError } from 'axios';

interface Props {
	url: string;
	fetcher: boolean;
}

// Custom hook
function useApiList<T>({ url, fetcher }: Props) {
	const [response, setResponse] = useState<T>([] as T);
	const [error, setError] = useState<AxiosError | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (fetcher) {
			getData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher]);

	const getData = useCallback(async () => {
		await api
			.get<T>(url)
			.then((response) => {
				setResponse(response.data);
			})
			.catch((error) => setError(error))
			.finally(() => setIsLoading(false));
	}, [url]);

	const revalidate = useCallback(() => {
		setIsLoading(true);
		getData();
	}, [getData]);

	return { response, isLoading, error, revalidate };
}

export default useApiList;
