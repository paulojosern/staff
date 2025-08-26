'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Calendar, CirclePlus } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function EventsPage() {
	const { push } = useRouter();

	return (
		<Pages title="Eventos" breadcrumb={dataBreadcrumb} icon={<Calendar />}>
			<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  align-center  mb-2 mt-2">
				<Button variant="default" onClick={() => push('/eventos/cadastrar')}>
					<CirclePlus />
					Adicionar novo evento
				</Button>
			</div>
			<div className="mx-auto py-2">
				<DataTable columns={columns} />
			</div>
		</Pages>
	);
}

export default AuthGuard(EventsPage, 'eventos');
