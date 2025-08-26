import { Toaster } from '@/components/ui/toaster';
import api from '@/lib/api/axios';
import { useAuth } from '@/providers/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const msg = {
	post: 'Inserido com sucesso.',
	put: 'Alterado com sucesso.',
	delete: 'Excluído com sucesso.',
};

interface Attribute {
	corporacaoAtributoID: number;
	chave: string;
	guid: string;
	valor: string;
}

export interface ErrorReq {
	response: {
		data: {
			message: string;
			[key: string]: string;
		};
	};
}
export function useAttribute<T>(guid: string, chave?: string) {
	const [corporacaoAtributoID, setCorporacaoAtributoID] = useState(0);
	const [attribute, setAttribure] = useState<T | null>(null);
	const [attributeAll, setAttribureAll] = useState<{
		[key: string]: Attribute;
	} | null>(null);
	const [loadingAttributes, setLoading] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		getAllAttributes();
		getAttributes();

		console.log('chamou aqui');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chave, guid]);

	const revalidate = () => {
		getAllAttributes();
		getAttributes();
	};

	const getAttributes = async () => {
		if (chave === undefined) return;
		setLoading(true);
		const url = `/api/sales/Atributo/GetAtributo?Chave=${chave}&CorporacaoGuid=${guid}`;
		await api
			.get(url)
			.then((response) => {
				setAttribure(JSON.parse(response.data.valor) as T);
				setCorporacaoAtributoID(response.data.corporacaoAtributoID);
			})
			.catch(() => setAttribure(null))
			.finally(() => {
				setLoading(false);
			});
	};

	const getAllAttributes = async () => {
		if (chave === undefined) {
			setLoading(true);
			const url = `/api/CorporacaoAtributo/List?CorporacaoGuid=${guid}`;
			await api
				.get(url)
				.then((response) => {
					const v = arrayToObject(response.data, 'chave') as {
						[key: string]: Attribute;
					};

					setAttribureAll(v);
				})
				.catch(() => setAttribureAll(null))
				.finally(() => {
					setLoading(false);
				});
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const arrayToObject = <T extends Record<string, any>, K extends keyof T>(
		array: T[],
		key: K
	): Record<string, T> =>
		array.reduce(
			(obj, item) => ({
				...obj,
				[item[key]]: item,
			}),
			{} as Record<string, T>
		);

	const request = async (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number,
		corporacaoID: number | null = null
	) => {
		// console.log(valor, corporacaoAtributoID)
		setLoading(true);
		try {
			if (corporacaoAtributoID) {
				const response = await api.put('api/CorporacaoAtributo', {
					corporacaoID: corporacaoID ?? user?.corporacaoID,
					chave,
					valor,
					corporacaoAtributoID,
					snChavePrivada: false,
					idAlteracao: user?.usuarioID.toString(),
				});
				if (response) {
					getAttributes();

					toast.custom((t) => (
						<Toaster t={t} type="success" description={msg['put']} />
					));
				}
			} else {
				const response = await api.post('api/CorporacaoAtributo', {
					corporacaoID: corporacaoID ?? user?.corporacaoID,
					chave,
					valor,
					snChavePrivada: false,
					idInclusao: user?.usuarioID.toString(),
				});
				if (response) {
					getAttributes();

					toast.custom((t) => (
						<Toaster t={t} type="success" description={msg['post']} />
					));
				}
			}
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
			setLoading(false);
		}
	};

	const remove = async (corporacaoAtributoID: number) => {
		try {
			const response = await api.delete(
				'api/CorporacaoAtributo?id=' + corporacaoAtributoID
			);
			if (response) {
				getAllAttributes();
				getAttributes();
				setCorporacaoAtributoID(0);
				toast.custom((t) => (
					<Toaster t={t} type="success" description="Removido com sucesso" />
				));
			}
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
		}
	};

	return {
		attributeAll,
		attribute,
		loadingAttributes,
		corporacaoAtributoID,
		remove: (corporacaoAtributoID: number) => remove(corporacaoAtributoID),
		addAttributes: (
			valor: string,
			chave: string,
			corporacaoAtributoID?: number,
			corporacaoID: number | null = null
		) => request(valor, chave, corporacaoAtributoID, corporacaoID),
		revalidate: () => revalidate(),
	};
}
