'use client';

// import { useCorporation } from '@/providers/useCorporation';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { CirclePlus, TicketPercent } from 'lucide-react';
import { use, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { DatKindTicketsEvent } from '../models';
import dynamic from 'next/dynamic';
import useFetch from '@/lib/api/swr';
const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

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

function KindTicketsParamsPage({ params }: Props) {
	const { id } = use(params);
	// const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);

	const url = `/api/EventosTipoIngresso/List?eventosID=${id}`;
	const { data, mutate } = useFetch<DatKindTicketsEvent[]>(url);

	return (
		<Pages
			title="Tipos de ingressos do evento"
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
					Adicionar tipo de ingresso para esse evento
				</Button>
			</div>
			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable columns={columns} data={data} mutate={mutate} />
				)}
			</div>

			{open && (
				<FormData
					open={open}
					setOpen={setOpen}
					mutate={mutate}
					eventosID={+id}
				/>
			)}
		</Pages>
	);
}

export default AuthGuard(KindTicketsParamsPage);
