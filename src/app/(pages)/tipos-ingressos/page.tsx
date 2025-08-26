'use client';

import { useCorporation } from '@/providers/useCorporation';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { CirclePlus, TicketPercent } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { DataTypeTicket } from './models';
import useFetch from '@/lib/api/swr';
import dynamic from 'next/dynamic';
const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function KindTicketsPage() {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);

	const url = `api/TipoIngresso/List?CorporacaoGuid=${corporation?.corporacaoGuid}&CorporacaoId=&${corporation?.corporacaoID}`;
	const { data, mutate } = useFetch<DataTypeTicket[]>(url);

	return (
		<Pages
			title="Tipos de Ingressos"
			breadcrumb={dataBreadcrumb}
			icon={<TicketPercent />}
		>
			<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar tipo de ingresso
				</Button>
			</div>
			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data as DataTypeTicket[]}
						mutate={mutate}
						propertySorter="nome"
					/>
				)}
			</div>

			{open && <FormData open={open} setOpen={setOpen} mutate={mutate} />}
		</Pages>
	);
}

export default AuthGuard(KindTicketsPage);
