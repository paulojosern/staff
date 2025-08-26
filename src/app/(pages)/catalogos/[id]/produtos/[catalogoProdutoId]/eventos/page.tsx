'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { BookOpen } from 'lucide-react';

import { use } from 'react';

import useApiList from '@/hooks/use-api-list';

import { useCorporation } from '@/providers/useCorporation';
import { DataTable } from './data-table';
import { columns } from './columns';
import { DataEvents } from '@/app/(pages)/eventos/models';
import { DataCatalogProduct } from '@/app/(pages)/catalogos/models';

interface Props {
	params: Promise<{ id: string; catalogoProdutoId: string }>;
}

function CatalogsProductsEventsPage({ params }: Props) {
	const { id, catalogoProdutoId } = use(params);
	const { corporation } = useCorporation();

	const events = useApiList<DataEvents[]>({
		url: `/api/Eventos/List?CorporacaoGuid=${corporation?.corporacaoGuid}&CatalogoProdutoID=${catalogoProdutoId}&LimiteData=true&NaoVinculado=true`,
		fetcher: !!corporation,
	});

	const product = useApiList<DataCatalogProduct>({
		url: `/api/CatalogoProduto?CatalogoProdutoId=${catalogoProdutoId}`,
		fetcher: !!corporation,
	});

	const dataBreadcrumb = [
		{
			title: 'Home',
			url: '/home',
		},
		{
			title: 'Produtos',
			url: `/catalogos/${id}/produtos`,
		},
	];

	return (
		<Pages
			title={`Eventos - ${product?.response?.titulo}`}
			breadcrumb={dataBreadcrumb}
			icon={<BookOpen />}
		>
			<div className="mx-auto">
				<DataTable
					columns={columns}
					catalogoProdutoId={+catalogoProdutoId}
					events={events.response}
				/>
			</div>
		</Pages>
	);
}

export default AuthGuard(CatalogsProductsEventsPage);
