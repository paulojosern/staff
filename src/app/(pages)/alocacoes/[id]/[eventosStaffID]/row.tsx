'use client';
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

import { DataListAlocation } from '../models';

import dynamic from 'next/dynamic';
import { KeyedMutator } from 'swr';
import { FiPlus } from 'react-icons/fi';

const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

interface Props<T> {
	row: Row<T>;
	index: number;
	mutate: KeyedMutator<DataListAlocation[]>;
}

export function DataTableRow<T>({ row, index, mutate }: Props<T>) {
	const item: DataListAlocation = row.original as DataListAlocation;

	const [open, setOpen] = React.useState(false);

	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			{open && (
				<FormData setOpen={setOpen} open={open} mutate={mutate} item={item} />
			)}
			<TableCell className="pl-4 font-bold">{index + 1}</TableCell>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
			<TableCell className="flex gap-6 align-middle justify-end">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							{item.prestadorID ? (
								<Button variant="secondary" onClick={() => setOpen(true)}>
									Visualizar
								</Button>
							) : (
								<Button variant="secondary" onClick={() => setOpen(true)}>
									Alocar <FiPlus />
								</Button>
							)}
						</TooltipTrigger>
						<TooltipContent>Alocar</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</TableCell>
		</TableRow>
	);
}
