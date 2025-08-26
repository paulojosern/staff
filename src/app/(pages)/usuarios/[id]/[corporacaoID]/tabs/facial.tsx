import { useAuth } from '@/providers/useAuth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import useApi from '@/hooks/use-api';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import useFetch from '@/lib/api/swr';
import { FiAlertCircle } from 'react-icons/fi';
import { formatDate } from '@/utils/formats';

export interface DataFacial {
	pessoaFotoID: number;
	tipoCaptura: string;
	nomeArquivo: string;
	imagem: string;
	imagemURL: string;
	hashImagem: string;
	status: string;
	ativo: true;
	pessoaID: number;
	descricaoVerificacao: string;
	idOperadorVerificacao: number;
	dtVerificacao: string;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}

const Status = {
	PendingValidation: 'EM VALIDAÇÃO',
	Approved: 'APROVADO',
	Disapproved: 'REPROVADO',
};

interface Props {
	pessoaID: number;
}

export default function TabFacial({ pessoaID }: Props) {
	const confirmationDialog = useConfirmationDialog();
	const { getRolesByPage } = useAuth();
	const roles = getRolesByPage('usuarios');
	const enabled = roles?.includes('user_register') || false;

	const url = `/api/PessoaFoto/List?pessoaid=${pessoaID}`;
	const { data } = useFetch<DataFacial[]>(url);

	async function onConfirm() {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  confirmar?`,
				confirmText: `Sim, confirmar`,
				cancelText: 'Não, cancelar',
			});
			onSubmit();
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	}

	const request = useApi<DataFacial>({
		url: '/api/PessoaFoto',
	});

	async function onSubmit() {
		if (data) {
			const payload = {
				...(data?.[0] as DataFacial),
				status: 'Disapproved',
			};
			await request.sendRequest('put', payload);
		}
	}

	if (!data) {
		return (
			<div className="rounded-md p-4 px-8 bg-slate-100 dark:bg-slate-800 flex items-center gap-2 text-sm">
				<FiAlertCircle />
				Nenhuma foto cadastrada
			</div>
		);
	}

	return (
		<div>
			<ConfirmationDialog hook={confirmationDialog} />

			<div className="w-full flex flex-col md:grid md:grid-cols-[400px_1fr]  gap-4 mb-4 ">
				{/* <div className="rounded-md p-4 px-8 bg-slate-100 dark:bg-slate-800">
					A senha deve conter letra maiúscula, minúscula, caracter especial e
					número.
				</div> */}

				<Image
					loading="lazy"
					src={`https://res.cloudinary.com/ligatechstaff/image/upload/${data[0]?.imagem}.avif`}
					alt="imagem evento"
					height={100}
					width={100}
					sizes="100vw"
					style={{
						width: '100%',
						height: 'auto',
						borderRadius: '5px',
					}}
				/>

				<div className="md:p-4">
					<span className="border border-solid border-[#ccc] rounded-full py-1 px-3 text-sm md:text-base">
						{Status[data[0]?.status as keyof typeof Status]}
					</span>

					<div className="mt-4">
						<label className="text-sm opacity-80 mr-2">Arquivo:</label>
						<span>{data[0]?.nomeArquivo}</span>
					</div>
					<div className="item">
						<label className="text-sm opacity-80 mr-2">Inclusão:</label>
						<span>{formatDate(data[0]?.dtAlteracao)}</span>
					</div>
					<div className="item">
						<label className="text-sm opacity-80 mr-2">idInclusao:</label>
						<span>{data[0]?.idInclusao}</span>
					</div>
					<div className="item">
						<label className="text-sm opacity-80 mr-2">Alteração:</label>
						<span>{formatDate(data[0]?.dtAlteracao)}</span>
					</div>
					<div className="item">
						<label className="text-sm opacity-80 mr-2">idAlteracao:</label>
						<span>{data[0]?.idAlteracao}</span>
					</div>
					<div className="hidden md:block">
						<label className="text-sm opacity-80 mr-2">Url:</label>
						<span className="">{data[0]?.imagemURL}</span>
					</div>
					{data[0]?.status != 'Disapproved' && (
						<div className="mt-4">
							<Button
								variant="default"
								className="ml-auto"
								disabled={!enabled}
								onClick={onConfirm}
							>
								Remover
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
