'use client';

import { useCorporation } from '@/providers/useCorporation';
import { use } from 'react';
import Pages from '@/theme/pages';
import { Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataEvents } from '../../models';
import api from '@/lib/api/axios';
import AuthGuard from '@/services/guard/authGuard';
import { RichTextEditor } from '@/components/elements/RichTextEditor';
import useDebounce from '@/hooks/useDebounce';
import useApi from '@/hooks/use-api';

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

function EventEditAboutPage({ params }: Props) {
	const { id } = use(params);
	const { corporation } = useCorporation();
	const [loading, setLoading] = useState(true);
	const [row, setRow] = useState<DataEvents>();
	const [title, setTitle] = useState<string>('');
	const [data, setData] = useState<string>('');

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

	const request = useApi<DataEvents>({
		url: '/api/Eventos',
	});

	function onChange(e: string) {
		setData(e);
	}

	const debouncedSearch = useDebounce(data, 1000);

	useEffect(() => {
		if (data) {
			request.sendRequest('put', {
				...row,
				sobreEvento: debouncedSearch,
			} as DataEvents);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch]);

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
				content={data || row?.sobreEvento || ''}
				onChange={onChange}
				placeholder="Digite seu texto aqui..."
				primary={corporation?.corPrimaria || ''}
				secondary={corporation?.corSecundaria || ''}
			/>
		</Pages>
	);
}

export default AuthGuard(EventEditAboutPage);
