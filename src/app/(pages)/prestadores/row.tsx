import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
// import { ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
// import { Switch } from '@/components/ui/switch';
// import {
// 	Tooltip,
// 	TooltipContent,
// 	TooltipProvider,
// 	TooltipTrigger,
// } from '@/components/ui/tooltip';

import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';

// import useApi, { ErrorReq } from '@/hooks/use-api';
// import { toast } from 'sonner';
// import { Toaster } from '@/components/ui/toaster';
// import { useRouter } from 'next/navigation';

interface Props<T> {
	row: Row<T>;
}
export function DataTableRow<T>({ row }: Props<T>) {
	// const { push } = useRouter();
	// const item: DataServiceUser = row.original as DataServiceUser;
	// const [open, setOpen] = React.useState(false);
	const confirmationDialog = useConfirmationDialog();
	// const [ativo, setAtivo] = React.useState(item?.ativo);

	// const { response, sendRequest } = useApi<T>({
	// 	url: '/api/Catalogo',
	// });

	// const handleDeleteClick = async () => {
	// 	try {
	// 		await confirmationDialog.openConfirmation({
	// 			title: 'Confirmar',
	// 			message: `Tem certeza que deseja  ${ativo ? 'desativar' : 'ativar'}?`,
	// 			confirmText: `Sim, ${ativo ? 'desativar' : 'ativar'}`,
	// 			cancelText: 'Não, cancelar',
	// 		});
	// 		setAtivo(!ativo);
	// 		save(!ativo);
	// 		mutate();
	// 	} catch {
	// 		// This code runs if the user clicks "No"
	// 		console.log('Operação cancelada pelo usuário.');
	// 	}
	// };

	// async function save(ativo: boolean) {
	// 	try {
	// 		await sendRequest('put', { ...row.original, ativo });
	// 		if (response) {
	// 			toast.custom((t) => (
	// 				<Toaster t={t} type="success" description="Alterado cpm sucesso" />
	// 			));
	// 			setOpen(false);
	// 			mutate();
	// 		}
	// 	} catch (error: unknown) {
	// 		const err: ErrorReq = error as ErrorReq;
	// 		toast.custom((t) => (
	// 			<Toaster
	// 				t={t}
	// 				type="error"
	// 				description={err.response.data.message || `Erro ao alterar`}
	// 			/>
	// 		));
	// 	}
	// }

	return (
		<TableRow data-state={row.getIsSelected() && 'selected'}>
			<ConfirmationDialog hook={confirmationDialog} />
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
			{/* <TableCell className="flex gap-6 align-middle justify-end">


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
			</TableCell> */}
		</TableRow>
	);
}
