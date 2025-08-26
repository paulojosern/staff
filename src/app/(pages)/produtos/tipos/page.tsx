'use client';

import { useCorporation } from '@/providers/useCorporation';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { CirclePlus, Cuboid } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { DataKindsProducts } from '../models';

import { FormData } from './form';
import useFetch from '@/lib/api/swr';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function KindProdutosPage() {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);

	const url = `/api/TipoProduto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&CorporacaoId=&${corporation?.corporacaoID}`;

	const { data, mutate } = useFetch<DataKindsProducts[]>(url);

	return (
		<Pages
			title="Tipos de Produtos"
			breadcrumb={dataBreadcrumb}
			icon={<Cuboid />}
		>
			<div className="container flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar tipo de produto
				</Button>
			</div>
			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data}
						mutate={mutate}
						propertySorter="nome"
					/>
				)}
			</div>

			{open && <FormData open={open} setOpen={setOpen} mutate={mutate} />}
		</Pages>
	);
}

export default AuthGuard(KindProdutosPage);
