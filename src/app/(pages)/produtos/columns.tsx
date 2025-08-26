'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataProducts } from './models';

export const columns: ColumnDef<DataProducts>[] = [
	// {
	// 	accessorKey: 'produtoID',
	// 	header: 'Id',
	// 	cell: ({ row }) => {
	// 		const amount = parseFloat(row.getValue('produtoID'));
	// 		const formatted = new Intl.NumberFormat('pt-BR', {
	// 			style: 'currency',
	// 			currency: 'BRL',
	// 		}).format(amount);

	// 		return <div className="text-left font-medium">{formatted}</div>;
	// 	},
	// },
	{
		accessorKey: 'nome',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nome
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'tipoProdutoID',

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tipo Produto
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
