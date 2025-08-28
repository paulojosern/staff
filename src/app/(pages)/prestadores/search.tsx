'use client';

import { DataCorporation } from '@/providers/useCorporation';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CircleAlert, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataServiceUser, DataUser } from './models';
import api from '@/lib/api/axios';
import { Input } from '@/components/ui/input';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { cpfCnpj } from '@/utils/formats';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { KeyedMutator } from 'swr';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import useApi from '@/hooks/use-api';

interface Props {
	corporation: DataCorporation | null;
	document?: string;
	mutate: KeyedMutator<DataServiceUser[]>;
}
export default function UsersServicesSearch({
	corporation,
	document,
	mutate,
}: Props) {
	const { push } = useRouter();
	const confirmationDialog = useConfirmationDialog();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [typeOfUser, setTypeOfUser] = useState('Staff');
	const [value, setValue] = useState('');
	const [isRegister, setIsRegister] = useState(false);
	const [usuario, setUsuario] = useState<DataUser | null>();

	const validate = (number: string) => {
		setValue(number);
		if (number?.length <= 11 && cpf.isValid(number)) {
			setError('');
			getUser(number, 'cpf');
		} else if (number.length > 13 && cnpj.isValid(number)) {
			setError('');
			getUser(number, 'cnpj');
		} else {
			setError('Documento inválido');
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		validate(e.target.value.replace(/[^\d]+/g, ''));
	};

	useEffect(() => {
		if (document) {
			validate(document);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [document]);

	const getUser = async (numero: string, typeOfDocument: string) => {
		setLoading(true);
		const url = `api/Usuario/GetDocumento?TipoDocumento=${typeOfDocument}&Numero=${numero}&CorporacaoGuid=${corporation?.guid}`;
		await api
			.get(url)
			.then((response) => {
				setUsuario(response.data);
				setIsRegister(false);
			})
			.catch(function () {
				setUsuario(null);
				setError('Usuário não encontrado');
				setIsRegister(true);
			})
			.finally(() => setLoading(false));
	};

	const { sendRequest } = useApi<DataServiceUser>({
		url: '/api/prestadores',
	});

	const onConfirm = async () => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja Adicionar?`,
				confirmText: `Sim, adicionar`,
				cancelText: 'Não, cancelar',
			});
			await onSave();
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

	const onSave = async () => {
		const payload = {
			corporacaoID: corporation?.corporacaoID,
			tipoPessoa: value.length <= 11 ? 'Fisica' : 'Juridica',
			pessoaID: usuario?.pessoaID,
			usuarioID: usuario?.usuarioID,
			nomePrestador: usuario?.nome,
			documentoPrestador: value,
			tipoPrestador: typeOfUser,
			ativo: true,
		} as unknown as DataServiceUser;

		await sendRequest('post', payload).then(() => {
			setValue('');
			setError('');
			setUsuario(null);
			mutate();
		});
	};

	return (
		<>
			<ConfirmationDialog hook={confirmationDialog} />
			<div className="mx-auto py-2 gap-4 flex flex-col md:flex-row">
				<Input
					placeholder="Digite o documento..."
					onChange={handleChange}
					value={cpfCnpj(value)}
					className="max-w-xl"
				/>

				<div className="flex gap-4 justify-between">
					<Button
						onClick={() => {
							setValue('');
							setError('');
							setUsuario(null);
						}}
						variant="secondary"
					>
						Limpar
					</Button>
					{isRegister && (
						<Button
							onClick={() => {
								push(`/usuarios/cadastrar/${value}`);
							}}
						>
							Cadastrar novo usuário
						</Button>
					)}
				</div>
			</div>
			{loading && (
				<div className="flex items-center  gap-2 mt-2">
					<Loader2 className="animate-spin" size={20} />
					Buscando usuário...
				</div>
			)}
			{error && (
				<div className="flex items-center  gap-2 my-2 text-red-700">
					<CircleAlert size={20} />
					{error}
				</div>
			)}

			{usuario && (
				<div className=" flex items-center  gap-4 mt-2">
					<div className="border rounded-lg py-2 px-3 ">{usuario?.nome}</div>
					<div className="border rounded-lg py-2 px-3 ">{cpfCnpj(value)}</div>

					<Select
						value={typeOfUser}
						onValueChange={(e) => {
							setTypeOfUser(e);
						}}
					>
						<SelectTrigger className="w-full md:w-[auto] py-5">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Staff">Staff</SelectItem>
								<SelectItem value="Produtor">Produtor</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button type="button" onClick={onConfirm}>
						Adicionar
					</Button>
				</div>
			)}
		</>
	);
}
