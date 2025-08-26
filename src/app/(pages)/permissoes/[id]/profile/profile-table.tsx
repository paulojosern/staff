import { TableCell, TableRow } from '@/components/ui/table';
import { Profile } from '../../models';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FiLock } from 'react-icons/fi';
import { Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { KeyedMutator } from 'swr';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import useApi from '@/hooks/use-api';
const FormProfile = dynamic(() => import('./form'), {
	ssr: false,
});
interface Props {
	row: Profile;
	mutateProfile: KeyedMutator<Profile[]>;
}
export default function ProfileTable({ row, mutateProfile }: Props) {
	const { push } = useRouter();
	const [open, setOpen] = useState(false);
	const confirmationDialog = useConfirmationDialog();
	const request = useApi<Profile>({
		url: '/api/PermissaoPerfil',
	});
	const handleDeleteClick = async () => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Excluir',
				message: `Tem certeza que deseja  excluir?`,
				confirmText: `Sim, excluir`,
				cancelText: 'Não, cancelar',
			});

			await save();
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

	async function save() {
		const data = {
			...row,
			ativo: false,
		} as unknown as Profile;

		request.sendRequest('put', data).then(() => {
			mutateProfile();
		});
	}

	return (
		<>
			<ConfirmationDialog hook={confirmationDialog} />
			{open && (
				<FormProfile
					open={open}
					setOpen={setOpen}
					mutate={mutateProfile}
					item={row}
				/>
			)}

			<TableRow>
				<TableCell>{row.nomePerfil}</TableCell>
				<TableCell>{row.descricaoPerfil}</TableCell>
				<TableCell>
					<div className="flex gap-2 justify-end">
						<Button
							color="primary"
							onClick={() => {
								push(`/permissoes/${row?.permissaoPerfilID}/regras`);
							}}
						>
							Permissões <FiLock />
						</Button>

						<Button
							variant="secondary"
							onClick={() => {
								setOpen(true);
							}}
						>
							Editar
						</Button>

						<Button
							variant={'destructive'}
							onClick={() => {
								handleDeleteClick();
							}}
						>
							<Trash />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		</>
	);
}
