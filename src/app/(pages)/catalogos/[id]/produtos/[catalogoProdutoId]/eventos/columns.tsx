'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { DataCatalogProductEvent } from '@/app/(pages)/catalogos/models';
import { formatDate } from '@/utils/formats';

export const columns: ColumnDef<DataCatalogProductEvent>[] = [
	{
		accessorKey: 'eventosID',
		header: 'ID',
	},
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
		cell: ({ row }) => {
			const data = row.getValue('nome') as number;
			return <p className="max-w-[280px] ">{data}</p>;
		},
	},

	{
		accessorKey: 'dataEvento',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Evento
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('dataEvento') as string;
			return <p className="w-[100px] ">{formatDate(data)}</p>;
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
			const data = row.getValue('dataInicio') as string;
			return <p className="w-[100px] ">{formatDate(data)}</p>;
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
			const data = row.getValue('dataFim') as string;
			return <p className="w-[100px] ">{formatDate(data)}</p>;
		},
	},
	{
		accessorKey: 'vendaLiberada',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					liberada
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('vendaLiberada') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'vendaEncerrada',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Encerrada
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('vendaEncerrada') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
	{
		accessorKey: 'invisivel',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Invisível
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const data = row.getValue('invisivel') as number;
			return <p className="w-[50px] ">{data ? 'Sim' : 'Nao'}</p>;
		},
	},
];
