'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataUserSearch } from './models';
import { formatOnlyDate } from '@/utils/formats';

export const columns: ColumnDef<DataUserSearch>[] = [
	{
		accessorKey: 'pessoaID',
		header: 'pessoaID',
	},
	{
		accessorKey: 'usuarioID',
		header: 'usuarioID',
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
	},
	{
		accessorKey: 'login',
		header: 'Login',
	},
	{
		accessorKey: 'ddd',
		header: 'DDD',
	},
	{
		accessorKey: 'numeroDocumento',
		header: 'Documento',
	},

	{
		accessorKey: 'numeroTelefone',
		header: 'Telefone',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},

	{
		accessorKey: 'dtNascimento',
		header: 'Data nasc.',
		cell: ({ row }) => {
			const date = row.getValue('dtNascimento') as string;
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
