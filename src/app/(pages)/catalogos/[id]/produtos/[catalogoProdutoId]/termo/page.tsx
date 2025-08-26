'use client';

import { useCorporation } from '@/providers/useCorporation';
import { use } from 'react';
import Pages from '@/theme/pages';
import { Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api/axios';
import AuthGuard from '@/services/guard/authGuard';
import { RichTextEditor } from '@/components/elements/RichTextEditor';
import useDebounce from '@/hooks/useDebounce';
import useApi from '@/hooks/use-api';
import { DataCatalogProduct } from '@/app/(pages)/catalogos/models';

interface Props {
	params: Promise<{ id: string; catalogoProdutoId: string }>;
}

function EventCatlogProductsTerm({ params }: Props) {
	const { id, catalogoProdutoId } = use(params);
	const { corporation } = useCorporation();
	const [loading, setLoading] = useState(true);
	const [row, setRow] = useState<DataCatalogProduct>();
	const [title, setTitle] = useState<string>('');
	const [data, setData] = useState<string>('');

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getData = async () => {
		const url = `api/CatalogoProduto?CatalogoProdutoID=${catalogoProdutoId}`;
		await api
			.get<DataCatalogProduct>(url)
			.then((response) => {
				setRow(response.data);
				setTitle(response.data.titulo);
			})
			.catch(() => {
				// setData([]);
				// setError('Nenhum resultado encontrado')
			})
			.finally(() => setLoading(false));
	};

	const request = useApi<DataCatalogProduct>({
		url: '/api/CatalogoProduto',
	});

	function onChange(e: string) {
		setData(e);
	}

	const debouncedSearch = useDebounce(data, 1000);

	useEffect(() => {
		if (data) {
			request.sendRequest('put', {
				...row,
				termoCompra: debouncedSearch === '<p></p>' ? '' : debouncedSearch,
			} as DataCatalogProduct);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch]);

	const dataBreadcrumb = [
		{
			title: 'Home',
			url: '/home',
		},
		{
			title: 'Produtos',
			url: `/catalogos/${id}/produtos`,
		},
	];

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin" size={40} />
			</div>
		);
	}

	return (
		<Pages title={title} breadcrumb={dataBreadcrumb} icon={<Calendar />}>
			<RichTextEditor
				content={data || row?.termoCompra || ''}
				onChange={onChange}
				placeholder="Digite seu texto aqui..."
				primary={corporation?.corPrimaria || ''}
				secondary={corporation?.corSecundaria || ''}
			/>
		</Pages>
	);
}

export default AuthGuard(EventCatlogProductsTerm);
