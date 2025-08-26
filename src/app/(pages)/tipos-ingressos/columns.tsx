'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataTypeTicket } from './models';
import { formatDate } from '@/utils/formats';

export const columns: ColumnDef<DataTypeTicket>[] = [
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
		accessorKey: 'descricao',
		header: 'Descrição',
	},
	{
		accessorKey: 'formaDesconto',
		header: 'Desconto',
	},
	{
		accessorKey: 'valor',
		header: 'Valor',
	},
	{
		accessorKey: 'snMeiaEntrada',
		header: 'Meia entrada',
		cell: ({ row }) => {
			const snMeiaEntrada = row.getValue('snMeiaEntrada') as string;
			return snMeiaEntrada ? 'Sim' : 'Não';
		},
	},
	{
		accessorKey: 'dtInclusao',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Inclusão
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dtInclusao') as string;
			return formatDate(date);
		},
	},

	{
		accessorKey: 'dtAlteracao',

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Alteração
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dtAlteracao') as string;
			return formatDate(date);
		},
	},
];
