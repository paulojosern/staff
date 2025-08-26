'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { BookOpen, CirclePlus } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { use, useState } from 'react';
import useFetch from '@/lib/api/swr';
import { DataCatalog, DataCatalogProduct } from '../../models';
import useApiList from '@/hooks/use-api-list';
import { DataProducts } from '@/app/(pages)/produtos/models';
import { useCorporation } from '@/providers/useCorporation';

const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
	{
		title: 'Catalogos',
		url: '/catalogos',
	},
];

interface Props {
	params: Promise<{ id: string }>;
}

function CatalogsProductsPage({ params }: Props) {
	const { id } = use(params);
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);

	const url = `/api/CatalogoProduto/List?CatalogoID=${id}`;
	const { data, mutate } = useFetch<DataCatalogProduct[]>(url);

	const products = useApiList<DataProducts[]>({
		url: `/api/Produto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&TipoProdutoID=0`,
		fetcher: !!corporation,
	});

	const catalogs = useApiList<DataCatalog[]>({
		url: `/api/Catalogo/List?CorporacaoGuid=${corporation?.corporacaoGuid}`,
		fetcher: !!corporation,
	});

	return (
		<Pages
			title={`Produto - ${
				catalogs?.response?.find((i) => i.catalogoID === +id)?.nome
			}`}
			breadcrumb={dataBreadcrumb}
			icon={<BookOpen />}
		>
			{open && (
				<FormData
					open={open}
					setOpen={setOpen}
					mutate={mutate}
					products={products.response.filter((item) => item.ativo)}
					catalogs={catalogs.response.filter((item) => item.ativo)}
				/>
			)}
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
						data={data as DataCatalogProduct[]}
						mutate={mutate}
						propertySorter="titulo"
						products={products.response.filter((item) => item.ativo)}
						catalogs={catalogs.response.filter((item) => item.ativo)}
					/>
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(CatalogsProductsPage);
