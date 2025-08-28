'use client';

import { useCorporation } from '@/providers/useCorporation';
import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Users2 } from 'lucide-react';
import { use } from 'react';
import UsersServicesSearch from '../search';
import useFetch from '@/lib/api/swr';
import { DataServiceUser } from '../models';
import { DataTable } from '../data-table';
import { columns } from '../columns';
import { useAuth } from '@/providers/useAuth';
const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

interface Props {
	params: Promise<{ document: string }>;
}

function UsersServicesIdPage({ params }: Props) {
	const { document } = use(params);
	const { user } = useAuth();
	const { corporation } = useCorporation();
	const url = `api/prestadores/List?CorporacaoID=${corporation?.corporacaoID}`;
	const { data, mutate } = useFetch<DataServiceUser[]>(url);

	return (
		<Pages title="Prestadores" breadcrumb={dataBreadcrumb} icon={<Users2 />}>
			<UsersServicesSearch
				corporation={corporation}
				document={document}
				mutate={mutate}
			/>
			<div className="mx-auto py-4 border-t mt-4">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data.filter((d) => +d.idInclusao === user?.usuarioID)}
						propertySorter="nomePrestador"
					/>
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(UsersServicesIdPage);
