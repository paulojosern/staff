import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { KeyedMutator } from 'swr';

import {
	DataListAlocation,
	DataPrestadoresListStaff,
	DataPrestadoresUserStaff,
} from '../models';

import useApi from '@/hooks/use-api';

import { useState } from 'react';
import useApiList from '@/hooks/use-api-list';
import { useCorporation } from '@/providers/useCorporation';
import { Autocomplete, Options } from '@/components/ui/auto-complete';
import { Loader2 } from 'lucide-react';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item: DataListAlocation;
	mutate: KeyedMutator<DataListAlocation[]>;
}

export function FormData({ open, setOpen, item, mutate }: Props) {
	const { corporation } = useCorporation();
	const [prestadorID, setPrestadorID] = useState<string>('');
	const [isEdit, setIsEdit] = useState<boolean>(!item.prestadorID);

	const user = useApiList<DataPrestadoresUserStaff[]>({
		url: `/api/EventosStaffPrestadores/ListCredencial?EventosStaffPrestadoresID=${item.eventosStaffPrestadoresID}`,
		fetcher: !!item.prestadorID,
	});
	const list = useApiList<DataPrestadoresListStaff[]>({
		url: `/api/Prestadores/ListPrestadores?CorporacaoID=${corporation?.corporacaoID}&TipoPrestador=Stafff&StaffID=${item.eventosStaffID}`,
		fetcher: !!item,
	});

	const requestSend = useApi<DataListAlocation>({
		url: '/api/EventosStaffPrestadores/PatchPrestador',
	});
	async function onSubmit() {
		const data = {
			eventosStaffID: item.eventosStaffID,
			eventosStaffPrestadoresID: item.eventosStaffPrestadoresID,
			prestadorID,
			ativo: true,
		} as unknown as DataListAlocation;
		requestSend.sendRequest('patch', data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	const options = list?.response?.map((item) => ({
		label: item.nomePrestador,
		value: item.prestadorID.toString(),
	})) as Options[];

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>
						{user?.response[0]?.prestador || 'Alocar Prestador'}{' '}
					</DialogTitle>
				</DialogHeader>
				{!!item.prestadorID && user.isLoading && (
					<div className="flex items-center justify-center w-full p-10 gap-2">
						<Loader2 className="animate-spin" color="#fff" />
						Carregando...
					</div>
				)}
				{user?.response[0] && !isEdit && (
					<div className="w-full">
						<div className="border rounded-md p-4 text-sm">
							<div className="flex flex-row flex-wrap gap-1">
								<label className="opacity-70">Zona:</label>
								<span>{user.response[0].zona}</span>
							</div>
							<div className="flex flex-row flex-wrap gap-1">
								<label className="opacity-70">Função:</label>
								<span>{user.response[0].funcao}</span>
							</div>
							<div className="flex flex-row flex-wrap gap-1">
								<label className="opacity-70">Produtor:</label>
								<span>{user.response[0].produtor}</span>
							</div>
							<div className="flex flex-row flex-wrap gap-1">
								<label className="opacity-70">Início Validade:</label>
								<span>{user.response[0].dataInicioValidade}</span>
							</div>
							<div className="flex flex-row flex-wrap gap-1">
								<label className="opacity-70">Fim validade:</label>
								<span>{user.response[0].dataFimValidade}</span>
							</div>
							<div className="flex flex-row flex-wrap gap-1">
								<label className="opacity-70">Geração credencial:</label>
								<span>{user.response[0].dataGeracaoCredencial}</span>
							</div>
						</div>
						<div className="flex justify-between gap-10 mt-4">
							<Button onClick={() => setOpen(false)} variant="secondary">
								Fechar
							</Button>
							<Button
								onClick={() => setIsEdit(true)}
								disabled={requestSend.isLoading}
							>
								Alterar Prestador
							</Button>
						</div>
					</div>
				)}

				{isEdit && (
					<div>
						{list.isLoading ? (
							<div className="flex items-center justify-center w-full p-10 gap-2">
								<Loader2 className="animate-spin" color="#fff" />
								Carregando...
							</div>
						) : (
							<>
								<div>
									<Autocomplete
										options={options || []}
										placeholder="Selecione o prestador"
										value={prestadorID}
										onChange={(value) => setPrestadorID(value)}
									/>
								</div>

								<div className="flex justify-between gap-10 mt-4">
									<Button onClick={() => setOpen(false)} variant="secondary">
										Cancelar
									</Button>
									<Button onClick={onSubmit} disabled={requestSend.isLoading}>
										{requestSend.isLoading ? (
											<Loader2 className="animate-spin" />
										) : (
											'Salvar'
										)}
									</Button>
								</div>
							</>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
