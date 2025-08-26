'use client';

import { useCorporation } from '@/providers/useCorporation';

import { use } from 'react';
import Pages from '@/theme/pages';
import { Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DataEvents, Datalocation } from '../models';

import api from '@/lib/api/axios';
import { FormData } from '../form';
import { DataProducts } from './../../produtos/models';

import AuthGuard from '@/services/guard/authGuard';
import useApiList from '@/hooks/use-api-list';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
	{
		title: 'Eventos',
		url: '/eventos',
	},
];

interface Props {
	params: Promise<{ id: string }>;
}

function EventEditPage({ params }: Props) {
	const { id } = use(params);
	const { corporation } = useCorporation();
	const [loading, setLoading] = useState(true);
	const [row, setRow] = useState<DataEvents>();
	const [title, setTitle] = useState<string>('');

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getData = async () => {
		const url = `/api/Eventos?EventosID=${id}`;
		await api
			.get(url)
			.then((response) => {
				setRow(response.data);
				setTitle(response.data.nome);
			})
			.catch(() => {
				// setData([]);
				// setError('Nenhum resultado encontrado')
			})
			.finally(() => setLoading(false));
	};

	const products = useApiList<DataProducts[]>({
		url: `/api/Produto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&TipoProdutoID=0`,
		fetcher: !!corporation,
	});

	const location = useApiList<[]>({
		url: `/api/EventosLocalizacao/List?CorporacaoID=${corporation?.corporacaoID}`,
		fetcher: !!corporation,
	});

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin" size={40} />
			</div>
		);
	}

	return (
		<Pages title={title} breadcrumb={dataBreadcrumb} icon={<Calendar />}>
			{products.response && (
				<FormData
					item={row}
					products={products.response as DataProducts[]}
					location={(location.response as Datalocation[]) || []}
				/>
			)}
		</Pages>
	);
}

export default AuthGuard(EventEditPage);
