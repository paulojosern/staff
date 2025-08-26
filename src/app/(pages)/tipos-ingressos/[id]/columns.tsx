'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DatKindTicketsEvent } from '../models';
import { formateReal } from '@/utils/formats';

export const columns: ColumnDef<DatKindTicketsEvent>[] = [
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
		accessorKey: 'descricaoIngressoNome',
		header: 'Descrição',
	},
	{
		accessorKey: 'qtdeMaximaDisponivel',
		header: 'Max. Disponível',
	},
	{
		accessorKey: 'qtdeLimiteCpf',
		header: 'Limite CPF',
	},
	{
		accessorKey: 'precoUnitario',
		header: 'Preço',
		cell: ({ row }) => {
			const data = row.getValue('precoUnitario') as string;
			return formateReal(data);
		},
	},
	{
		accessorKey: 'valorFace',
		header: 'Valor Face',
		cell: ({ row }) => {
			const data = row.getValue('valorFace') as string;
			return formateReal(data);
		},
	},
];
