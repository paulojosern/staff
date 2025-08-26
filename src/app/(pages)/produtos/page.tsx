'use client';

import api from '@/lib/api/axios';
import { useCorporation } from '@/providers/useCorporation';
// import { useToast } from '@/providers/ToastContext';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { CirclePlus, Cuboid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { DataKindsProducts, DataProducts } from './models';
import { Skeleton } from '@/components/ui/skeleton';
import { FormData } from './form';
import useFetch from '@/lib/api/swr';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function ProdutosPage() {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);
	const [kindProducts, setKindProducts] = useState<DataKindsProducts[]>([]);
	const [kind, setKind] = useState('');

	useEffect(() => {
		getKindProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation, open]);

	const url = `/api/Produto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&TipoProdutoID=${kind}`;
	const { data, mutate } = useFetch<DataProducts[]>(url);

	const getKindProducts = async () => {
		const url = `/api/TipoProduto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&CorporacaoId=&${corporation?.corporacaoID}`;
		await api
			.get(url)
			.then((response) => {
				setKindProducts(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	function handleSelect(value: string) {
		setKind(value);
	}

	return (
		<Pages title="Produtos" breadcrumb={dataBreadcrumb} icon={<Cuboid />}>
			<div className="container flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				{kindProducts.length === 0 ? (
					<div className="flex flex-col md:flex-row gap-4 w-full ">
						<Skeleton className="h-9 w-full md:w-auto" />
						<Skeleton className="h-9 w-full md:w-auto" />
					</div>
				) : (
					<div className="flex flex-col md:flex-row gap-4 w-full ">
						<div className="w-full md:w-auto">
							<Select onValueChange={handleSelect}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Tipo de produto" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={'0'}>Todos</SelectItem>
									{kindProducts.map((kindProduct) => (
										<SelectItem
											key={kindProduct.tipoProdutoID}
											value={kindProduct.tipoProdutoID.toString()}
										>
											{kindProduct.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Button variant="secondary" className="w-full md:w-auto">
							<CirclePlus />
							Adicionar tipo de produto
						</Button>
					</div>
				)}
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar produto
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

export default AuthGuard(ProdutosPage);
