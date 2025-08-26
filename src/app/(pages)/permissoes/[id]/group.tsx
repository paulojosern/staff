import useFetch from '@/lib/api/swr';
import { Group, Profile } from '../models';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { KeyedMutator } from 'swr';
import { FiPlus } from 'react-icons/fi';
import ProfileTable from './profile/profile-table';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

const FormProfile = dynamic(() => import('./profile/form'), {
	ssr: false,
});

interface Props {
	item: Group;
	mutate: KeyedMutator<Group[]>;
}
export default function GroupContent({ item, mutate }: Props) {
	const url = `api/PermissaoPerfil/List?PermissaoGrupoID=${item.permissaoGrupoID}`;
	const { data, mutate: mutateProfile } = useFetch<Profile[]>(url);
	const [openProfile, setOpenProfile] = useState(false);
	const [open, setOpen] = useState(false);

	const propsForm = {
		open,
		setOpen,
		item,
		mutate,
	};

	return (
		<div>
			<div className="text-xl font-medium uppercase flex items-center gap-4">
				{item.nomeGrupo}
				{open && <FormData {...propsForm} />}
				<Button
					variant="secondary"
					onClick={() => {
						setOpen(true);
					}}
				>
					Editar
				</Button>
			</div>
			<div className="text-sm mt-2">{item.descricaoGrupo}</div>

			<div className="border-t border-gray-200 mt-4 pt-4">
				<Button
					variant="default"
					onClick={() => {
						setOpenProfile(true);
					}}
				>
					Adicionar funcionalidade
					<FiPlus />
				</Button>
			</div>
			{openProfile && (
				<FormProfile
					open={openProfile}
					setOpen={setOpenProfile}
					mutate={mutateProfile}
				/>
			)}

			<div>
				{data && data?.length > 0 && (
					<div className="border rounded-md p-4 py-2 mt-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Funcionalidade</TableHead>
									<TableHead>Descrição</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.map((row) => (
									<ProfileTable
										row={row}
										mutateProfile={mutateProfile}
										key={row.permissaoPerfilID}
									/>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}
