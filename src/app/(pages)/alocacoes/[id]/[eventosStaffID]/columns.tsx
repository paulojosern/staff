'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataListAlocation } from '../models';

export const columns: ColumnDef<DataListAlocation>[] = [
	{
		accessorKey: 'nomePrestador',
		header: 'Nome',
		cell: ({ row }) => {
			const data = row.getValue('nomePrestador') as string;
			return <p>{data || 'Vázio'}</p>;
		},
	},
	{
		accessorKey: 'documentoPrestador',
		header: 'Documento',
		cell: ({ row }) => {
			const data = row.getValue('documentoPrestador') as string;
			return <p>{data || 'Vázio'}</p>;
		},
	},
];
