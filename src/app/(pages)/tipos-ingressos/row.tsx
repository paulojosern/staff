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

import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { DataTypeTicket } from './models';

import { KeyedMutator } from 'swr';
import dynamic from 'next/dynamic';
const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

interface Props<T> {
	row: Row<T>;
	mutate: KeyedMutator<DataTypeTicket[]>;
}
export function DataTableRow<T>({ row, mutate }: Props<T>) {
	const item: DataTypeTicket = row.original as DataTypeTicket;
	const [open, setOpen] = React.useState(false);
	const confirmationDialog = useConfirmationDialog();

	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			{open && (
				<FormData open={open} setOpen={setOpen} item={item} mutate={mutate} />
			)}
			<ConfirmationDialog hook={confirmationDialog} />
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
									setOpen(true);
								}}
							>
								<ExternalLink />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Editar</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</TableCell>
		</TableRow>
	);
}
