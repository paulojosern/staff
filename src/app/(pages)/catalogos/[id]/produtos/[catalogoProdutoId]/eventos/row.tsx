import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { ExternalLink, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataCatalogProductEvent } from '@/app/(pages)/catalogos/models';
import { FormData } from './form';
import { Switch } from '@/components/ui/switch';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import useApi from '@/hooks/use-api';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { openInNewTab } from '@/lib/utils';
import { useCorporation } from '@/providers/useCorporation';
import { Availability } from './availability';

interface Props<T> {
	row: Row<T>;
	mutate: (pageCurrent?: number, rowsPerPageCurrent?: number) => void;
	catalogoProdutoId: number;
}
export function DataTableRow<T>({ row, mutate, catalogoProdutoId }: Props<T>) {
	const { corporation } = useCorporation();
	const item: DataCatalogProductEvent = row.original as DataCatalogProductEvent;
	const [open, setOpen] = React.useState(false);

	const confirmationDialog = useConfirmationDialog();
	const [ativo, setAtivo] = React.useState(item?.ativo);
	const handleDeleteClick = async () => {
		setAtivo(!ativo);
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  ${ativo ? 'desativar' : 'ativar'}?`,
				confirmText: `Sim, ${ativo ? 'desativar' : 'ativar'}`,
				cancelText: 'Não, cancelar',
			});
			setAtivo(!ativo);
			save(!ativo);
			mutate();
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

	const { sendRequest } = useApi<T>({
		url: '/api/CatalogoProdutoEvento',
	});

	async function save(ativo: boolean) {
		await sendRequest('put', { ...row.original, ativo }).then(() => {
			setOpen(false);
			mutate();
		});
	}

	const [available, setAvailable] = React.useState(false);
	return (
		<>
			<ConfirmationDialog hook={confirmationDialog} />
			{available && (
				<Availability
					open={available}
					setOpen={setAvailable}
					catalogoProdutoEventoID={item?.catalogoProdutoEventoID}
				/>
			)}
			{open && (
				<FormData
					open={open}
					setOpen={setOpen}
					mutate={mutate}
					item={item}
					catalogoProdutoId={catalogoProdutoId}
				/>
			)}
			<TableRow data-state={row.getIsSelected() && 'selected'}>
				{row.getVisibleCells().map((cell) => (
					<TableCell key={cell.id} className="whitespace-normal">
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}

				<TableCell className="flex gap-4 align-middle justify-end px-6 align-center">
					<Button
						variant="secondary"
						onClick={() => {
							setAvailable(true);
						}}
					>
						Disponibilidade
					</Button>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										openInNewTab(
											`https://${
												corporation?.subDominio
											}.soudaliga.com.br/evento/${
												item?.dataEvento.split('T')[0]
											}/${item?.eventosID}`
										)
									}
								>
									<Link2 />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Abrir link do evento</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<div className="flex items-center space-x-2">
						<Switch
							checked={ativo}
							onCheckedChange={handleDeleteClick}
							id="airplane-mode"
						/>
					</div>
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
		</>
	);
}
