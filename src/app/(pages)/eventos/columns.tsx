'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataEvents } from './models';
import { formatDate } from '@/utils/formats';

export const columns: ColumnDef<DataEvents>[] = [
	{
		accessorKey: 'dataEvento',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Data
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dataEvento') as string;
			return <p className="w-[50px] ">{formatDate(date)}</p>;
		},
	},
	{
		accessorKey: 'dataInicio',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Início
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dataInicio') as string;
			return <p className="w-[50px] ">{formatDate(date)}</p>;
		},
	},
	{
		accessorKey: 'dataFim',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fim
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dataFim') as string;
			return <p className="w-[50px] ">{formatDate(date)}</p>;
		},
	},
	{
		accessorKey: 'nome',
		header: 'Nome',
		cell: ({ row }) => {
			const data = row.getValue('nome') as string;
			return <p className="w-[350px] ">{data}</p>;
		},
	},

	{
		accessorKey: 'localEvento',
		header: 'Local',
		cell: ({ row }) => {
			const localEvento = row.getValue('localEvento') as string;
			return localEvento || '-';
		},
	},
	{
		accessorKey: 'qtdeMaximaDisponivel',
		header: 'Máximo',
	},
];
