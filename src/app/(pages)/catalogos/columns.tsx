'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { DataCatalog } from './models';
import { formatDate } from '@/utils/formats';

const getCatalogsType = (value: number) => {
	const v = [
		{ id: 0, nome: 'Eventos' },
		{ id: 1, nome: 'Produtos' },
	];
	return v.find((g) => g.id === value)?.nome;
};

const getPriority = (value: number) => {
	const v = [
		{ id: 1, nome: 'Oferta' },
		{ id: 0, nome: 'Normal' },
	];
	return v.find((g) => g.id === value)?.nome;
};

export const columns: ColumnDef<DataCatalog>[] = [
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
		accessorKey: 'tipoCatalogo',

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tipo
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('tipoCatalogo') as number;
			return <p className="w-[50px] ">{getCatalogsType(data)}</p>;
		},
	},
	{
		accessorKey: 'prioridade',

		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Prioridade
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('prioridade') as number;
			return <p className="w-[50px] ">{getPriority(data)}</p>;
		},
	},
	{
		accessorKey: 'dataInicioVigencia',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Início Vigência
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dataInicioVigencia') as string;
			return <p className="w-[50px] ">{formatDate(date)}</p>;
		},
	},
	{
		accessorKey: 'dataFimVigencia',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fim Vigência
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue('dataFimVigencia') as string;
			return <p className="w-[50px] ">{formatDate(date)}</p>;
		},
	},
];
