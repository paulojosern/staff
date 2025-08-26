// useApi.ts
import { useState, useCallback } from 'react';
import { useCorporation } from '@/providers/useCorporation';
import { useAuth } from '@/providers/useAuth';
import api from '@/lib/api/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';

type HttpMethod = 'post' | 'put' | 'patch' | 'delete';
export interface ErrorReq {
	response: {
		data: {
			message: string;
			[key: string]: string;
		};
	};
}

const msg = {
	post: 'Inserido com sucesso.',
	put: 'Alterado com sucesso.',
	patch: 'Alterado com sucesso.',
	delete: 'Excluído com sucesso.',
};

interface Props {
	url: string;
}

// Custom hook
function useApi<T>({ url }: Props) {
	const { corporation } = useCorporation();
	const { user } = useAuth();
	const [response, setResponse] = useState<T | null>(null);
	const [error, setError] = useState<AxiosError | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const sendRequest = useCallback(
		async (
			method: HttpMethod,
			changes: T,
			id?: string,
			corporacaoID?: number
		) => {
			setIsLoading(true);
			setError(null);

			try {
				let axiosResponse: AxiosResponse<T>;

				if (method === 'put') {
					axiosResponse = await api.put(url, {
						...changes,
						corporacaoID: corporacaoID ?? corporation?.corporacaoID,
						idAlteracao: user?.usuarioID.toString(),
					});
				} else if (method === 'patch') {
					axiosResponse = await api.patch(url, {
						...changes,
						corporacaoGuid: corporacaoID ?? corporation?.corporacaoGuid,
					});
				} else if (method === 'delete') {
					axiosResponse = await api.delete(url + id);
				} else {
					axiosResponse = await api.post(url, {
						...changes,
						corporacaoID: corporacaoID ?? corporation?.corporacaoID,
						ativo: true,
						idInclusao: user?.usuarioID.toString(),
					});
				}

				toast.custom((t) => (
					<Toaster t={t} type="success" description={msg[method]} />
				));

				setResponse(axiosResponse.data);
				return axiosResponse.data;
			} catch (error) {
				const axiosError = error as ErrorReq;
				toast.custom((t) => (
					<Toaster
						t={t}
						type="error"
						description={
							axiosError?.response?.data?.message || 'Erro na operação.'
						}
					/>
				));
			} finally {
				setIsLoading(false);
			}
		},
		[
			corporation?.corporacaoGuid,
			corporation?.corporacaoID,
			url,
			user?.usuarioID,
		]
	);

	return { response, error, isLoading, sendRequest };
}

export default useApi;
