'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataUserPermissions } from './model';

// import { formatDate } from '@/utils/formats';

export const columns: ColumnDef<DataUserPermissions>[] = [
	{
		accessorKey: 'nomeGrupo',
		header: 'Grupo',
	},
	{
		accessorKey: 'nomePerfil',
		header: 'Perfil',
	},
	{
		accessorKey: 'descricaoPerfil',
		header: 'Descrição',
	},
];
