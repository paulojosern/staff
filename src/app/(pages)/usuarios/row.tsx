import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { DataUserSearch } from './models';

interface Props<T> {
	row: Row<T>;
}
export function DataTableRow<T>({ row }: Props<T>) {
	const { push } = useRouter();
	const item = row.original as DataUserSearch;
	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
			<TableCell className="flex gap-4 align-middle justify-end">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									push(`/usuarios/${item.pessoaID}/${item.corporacaoID}`);
								}}
							>
								<ExternalLink />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Abrir</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</TableCell>
		</TableRow>
	);
}
