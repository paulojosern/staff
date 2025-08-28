'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataServiceUser } from './models';
import { formatOnlyDate } from '@/utils/formats';

export const columns: ColumnDef<DataServiceUser>[] = [
	{
		accessorKey: 'nomePrestador',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Prestador
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'documentoPrestador',
		header: 'Documento',
	},
	{
		accessorKey: 'tipoPessoa',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tipo de pessoa
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'tipoPrestador',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tipo de prestador
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
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
			return formatOnlyDate(date);
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
			return formatOnlyDate(date);
		},
	},

	{
		accessorKey: 'ativo',
		header: 'Ativo',
		cell: ({ row }) => {
			const date = row.getValue('ativo') as string;
			return date ? 'Sim' : 'Não';
		},
	},
];
