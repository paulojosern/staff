'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { BookOpen, CirclePlus } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

import { useCorporation } from '@/providers/useCorporation';
import { useState } from 'react';
import useFetch from '@/lib/api/swr';
import { DataCatalog } from './models';
import { FormData } from './form';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function CatalogsPage() {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);

	const url = `/api/Catalogo/List?CorporacaoGuid=${corporation?.corporacaoGuid}`;
	const { data, mutate } = useFetch<DataCatalog[]>(url);

	return (
		<Pages title="Catalogos" breadcrumb={dataBreadcrumb} icon={<BookOpen />}>
			{open && <FormData open={open} setOpen={setOpen} mutate={mutate} />}
			<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  align-center  mb-2 mt-2">
				<Button variant="default" onClick={() => setOpen(true)}>
					<CirclePlus />
					Adicionar novo catalogo
				</Button>
			</div>
			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data as DataCatalog[]}
						mutate={mutate}
						propertySorter="nome"
					/>
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(CatalogsPage);
