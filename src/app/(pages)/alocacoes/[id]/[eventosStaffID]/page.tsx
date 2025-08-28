'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Users } from 'lucide-react';
import { use } from 'react';
import useFetch from '@/lib/api/swr';
import { DataListAlocation } from '../models';
import { DataTable } from './data-table';
import { columns } from './columns';

interface Props {
	params: Promise<{ id: string; eventosStaffID: string }>;
}

function AlocationsListPage({ params }: Props) {
	const { id, eventosStaffID } = use(params);
	const dataBreadcrumb = [
		{
			title: 'Home',
			url: '/home',
		},
		{
			title: 'Eventos',
			url: '/alocacoes/' + id,
		},
	];
	const url = `/api/EventosStaffPrestadores/List?EventosStaffID=${eventosStaffID}&ProdutorID=${id}`;

	const { data, mutate } = useFetch<DataListAlocation[]>(url);

	return (
		<Pages
			title="Alocações de usuários"
			breadcrumb={dataBreadcrumb}
			icon={<Users />}
		>
			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data}
						mutate={mutate}
						propertySorter="nomePrestador"
					/>
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(AlocationsListPage);
