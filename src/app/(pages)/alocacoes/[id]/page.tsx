'use client';
import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Calendar } from 'lucide-react';
import { use } from 'react';
import useFetch from '@/lib/api/swr';
import { DataAllocation } from './models';
import { useAuth } from '@/providers/useAuth';
import { DataTable } from './data-table';
import { columns } from './columns';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

interface Props {
	params: Promise<{ id: string }>;
}

function AlocationsPage({ params }: Props) {
	const { id } = use(params);
	const { user } = useAuth();

	const param = user?.prestadorId !== '0' ? 'prestadorId' : 'ProdutorID';

	const url = `/api/EventosStaffPrestadores/ListAlocacoes?${param}=${id}`;
	const { data } = useFetch<DataAllocation[]>(url);

	return (
		<Pages
			title="Alocações eventos"
			breadcrumb={dataBreadcrumb}
			icon={<Calendar />}
		>
			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data}
						propertySorter="nome"
						id={+id}
					/>
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(AlocationsPage);
