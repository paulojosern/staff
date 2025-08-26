import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import {
	CircleCheck,
	ExternalLink,
	FileText,
	ImageIcon,
	LucideInfo,
	TicketPercent,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import { DataEvents, tipoControleAcesso, tipoLeituraQCode } from './models';

import { useRouter } from 'next/navigation';

interface Props<T> {
	row: Row<T>;
	mutate: (
		search: string,
		pageCurrent?: number,
		rowsPerPageCurrent?: number
	) => void;
}
export function DataTableRow<T>({ row }: Props<T>) {
	const { push } = useRouter();
	const item: DataEvents = row.original as DataEvents;

	const renderObj = (e: { [key: string]: string }, t: string): string => e[t];

	return (
		<>
			<TableRow data-state={row.getIsSelected() && 'selected'}>
				{row.getVisibleCells().map((cell) => (
					<TableCell key={cell.id} className="whitespace-normal">
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}
				<TableCell>
					{renderObj(tipoControleAcesso, item.tipoControleAcesso)}
				</TableCell>
				<TableCell>
					{renderObj(tipoLeituraQCode, item.tipoLeituraQrCode)}
				</TableCell>

				<TableCell className="flex gap-4 align-middle justify-end px-6 align-center">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => push(`/tipos-ingressos/${item.eventosID}`)}
								>
									<TicketPercent />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Tipos de ingressos</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					{item.snStaff && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" onClick={() => {}}>
										<Users />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Staff</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
					{item.snInfoAdicionalBeneficiario && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={() => {
											push(`/eventos/${item.eventosID}/informacoes`);
										}}
									>
										<LucideInfo />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Informações adicionais</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="relative"
									onClick={() => {
										push(`/eventos/${item.eventosID}/sobre`);
									}}
								>
									{item.sobreEvento && (
										<CircleCheck
											size={8}
											className="absolute top-[-6px] right-[-8px]"
										/>
									)}
									<FileText />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Sobre o evento</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="relative"
									onClick={() => {
										push(`/eventos/${item.eventosID}/imagem`);
									}}
								>
									{item.imagemEvento && (
										<CircleCheck
											size={8}
											className="absolute top-[-6px] right-[-8px]"
										/>
									)}
									<ImageIcon />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Imagens do evento</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => {
										push(`/eventos/${item.eventosID}`);
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
