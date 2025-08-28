import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import { DataAllocation } from './models';

import { useRouter } from 'next/navigation';

interface Props<T> {
	row: Row<T>;
	id: number;
}
export function DataTableRow<T>({ row, id }: Props<T>) {
	const { push } = useRouter();
	const item: DataAllocation = row.original as DataAllocation;

	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
			<TableCell className="flex gap-6 align-middle justify-end">
				{item.resumoAlocacoes.map((resumo, i) => (
					<div key={i} className="flex gap-2">
						<Button
							variant="secondary"
							onClick={() => push(`/alocacoes/${id}/${item.eventosStaffID}`)}
						>
							{resumo.prestadoresAlocados}
						</Button>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										onClick={() =>
											push(`/alocacoes/${id}/${item.eventosStaffID}`)
										}
									>
										Alocados
									</Button>
								</TooltipTrigger>
								<TooltipContent>Editar</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				))}
			</TableCell>
		</TableRow>
	);
}
