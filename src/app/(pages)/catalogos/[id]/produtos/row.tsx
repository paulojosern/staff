import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { ExternalLink, FileText, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { DataCatalog, DataCatalogProduct } from '../../models';
import { FormData } from './form';
import { KeyedMutator } from 'swr';
import useApi, { ErrorReq } from '@/hooks/use-api';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { DataProducts } from '@/app/(pages)/produtos/models';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const Tax = dynamic(() => import('./tax/index').then((mod) => mod.Tax), {
	ssr: false,
});

interface Props<T> {
	row: Row<T>;
	mutate: KeyedMutator<DataCatalogProduct[]>;
	catalogs: DataCatalog[];
	products: DataProducts[];
}
export function DataTableRow<T>({ row, mutate, catalogs, products }: Props<T>) {
	const { push } = useRouter();
	const item: DataCatalogProduct = row.original as DataCatalogProduct;
	const [open, setOpen] = React.useState(false);
	const [openTax, setOpenTax] = React.useState(false);
	const confirmationDialog = useConfirmationDialog();
	const [ativo, setAtivo] = React.useState(item?.ativo);

	const { response, sendRequest } = useApi<T>({
		url: '/api/CatalogoProduto',
	});

	const handleDeleteClick = async () => {
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

	async function save(ativo: boolean) {
		try {
			await sendRequest('put', { ...row.original, ativo });
			if (response) {
				toast.custom((t) => (
					<Toaster t={t} type="success" description="Alterado cpm sucesso" />
				));
				setOpen(false);
				mutate();
			}
		} catch (error: unknown) {
			const err: ErrorReq = error as ErrorReq;
			toast.custom((t) => (
				<Toaster
					t={t}
					type="error"
					description={err.response.data.message || `Erro ao alterar`}
				/>
			));
		}
	}

	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			{open && (
				<FormData
					open={open}
					setOpen={setOpen}
					item={item}
					mutate={mutate}
					catalogs={catalogs}
					products={products}
				/>
			)}
			{openTax && (
				<Tax open={openTax} setOpen={setOpenTax} id={item.catalogoProdutoID} />
			)}
			<ConfirmationDialog hook={confirmationDialog} />
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id} className="whitespace-normal">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
			<TableCell className="flex gap-4 align-middle justify-end">
				<Button
					variant="secondary"
					onClick={() => {
						push(
							`/catalogos/${item.catalogoID}/produtos/${item.catalogoProdutoID}/eventos`
						);
					}}
				>
					Eventos
				</Button>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									push(
										`/catalogos/${item.catalogoID}/produtos/${item.catalogoProdutoID}/termo`
									);
								}}
							>
								<FileText />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Termo</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				{item.snPermiteTaxa && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => {
										setOpenTax(true);
									}}
								>
									<Percent />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Taxas</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
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
	);
}
