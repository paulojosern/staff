import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import useApiList from '@/hooks/use-api-list';
import { formateReal } from '@/utils/formats';
import { useEffect, useState } from 'react';

interface DataAvailable {
	catProdutoEventoDisponibilidadeID: number;
	catalogoProdutoEventoID: number;
	dtAlteracao: string;
	dtInclusao: string;
	idAlteracao: string;
	idInclusao: string;
	precoUnitario: number;
	qtdeDisponivel: number;
	qtdeReservada: number;
	qtdeTotal: number;
	qtdeUtilizada: number;
	tipoIngressoID: number;
	nome: string;
}
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	catalogoProdutoEventoID: number;
}

export function Availability({
	open,
	setOpen,
	catalogoProdutoEventoID,
}: Props) {
	const [data, setData] = useState<DataAvailable[]>([]);
	const [total, setTotal] = useState<DataAvailable | undefined>();

	const list = useApiList<DataAvailable[]>({
		url: `/api/CatalogoProdutoEventoDisponibilidade/List?CatalogoProdutoEventoID=${catalogoProdutoEventoID}`,
		fetcher: !!catalogoProdutoEventoID,
	});

	useEffect(() => {
		if (list.response) {
			setData(list.response.filter((i) => !i.nome?.includes('Totalizador')));
			setTotal(list.response.find((i) => i.nome?.includes('Totalizador')));
		}
	}, [list.response]);

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[825px] overflow-y-auto max-h-[90dvh]  text-left">
				<DialogHeader className="text-left">
					<DialogTitle>Disponibilidade</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-3 gap-4">
					<div className="border rounded-md px-4 py-2 flex flex-col justify-between">
						<p className="text-xs sm:text-sm ">Quantidade máxima</p>
						<p className="text-xl font-semibold text-right">
							{total?.qtdeTotal}
						</p>
					</div>
					<div className="border  rounded-md px-4 py-2 border-blue-400 flex flex-col justify-between">
						<p className="text-xs sm:text-sm text-blue-600">Disponíveis</p>
						<p className="text-xl font-semibold text-right text-blue-600">
							{total?.qtdeDisponivel}
						</p>
					</div>
					<div className="border rounded-md px-4 py-2 border-red-400 flex flex-col justify-between">
						<p className="text-xs sm:text-sm text-red-700">Indisponíveis</p>
						<p className="text-xl font-semibold text-right text-red-600">
							{total?.qtdeUtilizada}
						</p>
					</div>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tipo de ingresso</TableHead>
							<TableHead>Valor unitário</TableHead>
							<TableHead>Utilizado</TableHead>
							<TableHead>Reservado</TableHead>
							<TableHead>Máximo por tipo</TableHead>
							<TableHead>Disponibilidade por tipo</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((item) => (
							<TableRow key={item.catProdutoEventoDisponibilidadeID}>
								<TableCell align="center">{item.nome}</TableCell>
								<TableCell align="center">
									{formateReal(item.precoUnitario)}
								</TableCell>
								<TableCell align="center">{item.qtdeUtilizada}</TableCell>
								<TableCell align="center">{item.qtdeReservada}</TableCell>
								<TableCell align="center">{item.qtdeTotal}</TableCell>
								<TableCell align="center">{item.qtdeDisponivel}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</DialogContent>
		</Dialog>
	);
}
