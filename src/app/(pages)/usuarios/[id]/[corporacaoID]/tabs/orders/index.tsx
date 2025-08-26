import { useAuth } from '@/providers/useAuth';
import useFetch from '@/lib/api/swr';
import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

import { columns } from './columns';

import { DataTable } from './data-table';

interface TypesSearch {
	DtCompra?: string;
	DtEvento?: string;
	cpf?: string;
	Pago?: boolean;
}
export interface DataOrders {
	catalogoID: string;
	corporacaoID: string;
	dataCompra: string;
	dataEvento: string;
	formaPagamento: string;
	nome: string;
	numero: string;
	numeroPedidoX: string;
	pedidoID: string;
	statusPedido: string;
	tipoDocumento: string;
	usuarioID: string;
	valorTotal: string;
}

interface Props {
	document: string;
	guid?: string;
}

export default function TabOrders({ document, guid }: Props) {
	const { getRolesByPage } = useAuth();
	const roles = getRolesByPage('usuarios');
	const enabled = roles?.includes('user_register') || false;

	const [search, setSearch] = useState<TypesSearch>({
		DtCompra: undefined,
		DtEvento: undefined,
		Pago: true,
	});

	const url = `api/bi/Report/ListarPedido?cpf=${document}&DtCompra=${
		search?.DtCompra ?? ''
	}&DtEvento=${search?.DtEvento ?? ''}&Pago=${
		search?.Pago
	}&CorporacaoGuid=${guid}`;

	const { data } = useFetch<{ linhaList: DataOrders[] }>(url);

	const linhaList = (data?.linhaList as DataOrders[]) || [];

	if (!enabled) {
		return (
			<div className="rounded-md p-4 px-8 bg-slate-100 dark:bg-slate-800 text-sm">
				Você não tem permissão.
			</div>
		);
	}

	return (
		<div>
			<div className="w-full flex flex-col md:grid md:grid-cols-[180px_180px_100px_100px]  gap-4 mb-4 ">
				<DatePicker
					value={search.DtCompra}
					placeholder="Data da compra"
					onChange={(e) =>
						setSearch({
							...search,
							DtCompra: e?.split('T')[0],
						})
					}
				/>
				<DatePicker
					value={search.DtEvento}
					placeholder="Data do evento"
					onChange={(e) =>
						setSearch({
							...search,
							DtEvento: e?.split('T')[0],
						})
					}
				/>
				<div className="flex items-center gap-2">
					Pagos{' '}
					<Switch
						checked={search.Pago}
						onCheckedChange={(e) =>
							setSearch({
								...search,
								Pago: e,
							})
						}
					/>
				</div>
				<Button
					variant="outline"
					onClick={() =>
						setSearch({
							DtCompra: undefined,
							DtEvento: undefined,
							Pago: true,
						})
					}
				>
					Limpar
				</Button>
			</div>
			{linhaList?.length > 0 && (
				<DataTable columns={columns} data={linhaList} />
			)}
		</div>
	);
}
