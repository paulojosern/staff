'use client';

import { ColumnDef } from '@tanstack/react-table';

// import { formatDate } from '@/utils/formats';
import { DataOrders } from '.';

export const columns: ColumnDef<DataOrders>[] = [
	{
		accessorKey: 'pedidoID',
		header: 'pedidoID',
	},
	{
		accessorKey: 'dataEvento',
		header: 'Data evento',
	},
	{
		accessorKey: 'dataCompra',
		header: 'Data da compra',
	},
	{
		accessorKey: 'formaPagamento',
		header: 'Forma de pagamento',
	},
	{
		accessorKey: 'statusPedido',
		header: 'statusPStatusedido',
	},
	{
		accessorKey: 'valorTotal',
		header: 'Valor',
	},
];
