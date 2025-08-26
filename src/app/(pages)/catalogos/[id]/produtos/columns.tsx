'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { DataCatalogProduct } from '../../models';

export const columns: ColumnDef<DataCatalogProduct>[] = [
	{
		accessorKey: 'titulo',
		header: 'Titulo',
		cell: ({ row }) => {
			const data = row.getValue('titulo') as number;
			return <p className="w-[280px] ">{data}</p>;
		},
	},
	{
		accessorKey: 'snPermiteTaxa',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Taxa
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('snPermiteTaxa') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'snLimitaporCPF',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Limita CPF
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('snLimitaporCPF') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'permiteMeiaEntrada',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Meia entrada
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('permiteMeiaEntrada') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'snPermiteCupom',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Cupom
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('snPermiteCupom') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'snCatalogoExterno',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Externo
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('snCatalogoExterno') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'qtdeMaximaDisponivel',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Qtd. max.
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
