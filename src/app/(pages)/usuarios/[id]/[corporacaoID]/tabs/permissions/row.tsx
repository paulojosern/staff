import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { TableCell, TableRow } from '@/components/ui/table';

import { Switch } from '@/components/ui/switch';
import { DataUserPermissions } from './model';
import useApi from '@/hooks/use-api';
import { KeyedMutator } from 'swr';

interface Props<T> {
	row: Row<T>;
	mutate: KeyedMutator<DataUserPermissions[]>;
}
export function DataTableRow<T>({ row, mutate }: Props<T>) {
	const item: DataUserPermissions = row.original as DataUserPermissions;

	const request = useApi<DataUserPermissions>({
		url: '/api/UsuarioPerfil',
	});

	async function onSubmit(ativo: boolean) {
		const payload = {
			...item,
			ativo,
		} as unknown as DataUserPermissions;
		await request.sendRequest('put', payload).then(() => {
			mutate();
		});
	}

	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
			<TableCell className="flex gap-6 align-middle justify-end">
				<Switch
					checked={item?.ativo}
					name="snLimitaporCPF"
					onCheckedChange={(e) => onSubmit(e)}
				/>
			</TableCell>
		</TableRow>
	);
}
