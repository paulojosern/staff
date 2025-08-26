'use client';

import { DataCorporation } from '@/providers/useCorporation';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Building, CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

// import { FormData } from './form';
import useFetch from '@/lib/api/swr';
import { FormData } from './form';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function CorporationsPage() {
	const [open, setOpen] = useState(false);

	const url = `/api/BI/Dash/DashCorporacoes`;

	const { data, mutate } = useFetch<{ corporacoesList: DataCorporation[] }>(
		url
	);

	return (
		<Pages title="Corporações" breadcrumb={dataBreadcrumb} icon={<Building />}>
			<div className="container flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar corporação
				</Button>
			</div>
			<div className="mx-auto py-2">
				{data && data?.corporacoesList?.length > 0 && (
					<DataTable
						columns={columns}
						data={data?.corporacoesList as DataCorporation[]}
						propertySorter="nome"
					/>
				)}
			</div>

			{open && (
				<FormData open={open} setOpen={setOpen} mutate={mutate as never} />
			)}
		</Pages>
	);
}

export default AuthGuard(CorporationsPage);
