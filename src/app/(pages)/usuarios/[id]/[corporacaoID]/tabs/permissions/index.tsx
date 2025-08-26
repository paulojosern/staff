import { useAuth } from '@/providers/useAuth';
import useFetch from '@/lib/api/swr';
import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import { columns } from './columns';
import { DataUserPermissions } from './model';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

interface Props {
	corporacaoID?: number;
	usuarioID: string;
}

export default function TabPermissions({ corporacaoID, usuarioID }: Props) {
	const { getRolesByPage } = useAuth();
	const roles = getRolesByPage('usuarios');
	const enabled = roles?.includes('user_register') || false;

	const url = `api/UsuarioPerfil/List?CorporacaoID=${corporacaoID}&UsuarioID=${usuarioID}`;

	const { data, mutate } = useFetch<DataUserPermissions[]>(url);

	const [open, setOpen] = useState(false);

	if (!enabled) {
		return (
			<div className="rounded-md p-4 px-8 bg-slate-100 dark:bg-slate-800 text-sm">
				Você não tem permissão.
			</div>
		);
	}

	return (
		<div>
			{open && (
				<FormData
					open={open}
					setOpen={setOpen}
					mutate={mutate}
					corporacaoID={corporacaoID}
					usuarioID={usuarioID}
				/>
			)}
			<div className="w-full flex flex-col md:grid md:grid-cols-[180px_180px_100px_100px]  gap-4 mb-4 ">
				<Button variant="outline" onClick={() => setOpen(true)}>
					Adicionar permissão
				</Button>
			</div>
			{data && data?.length > 0 && (
				<DataTable columns={columns} data={data} mutate={mutate} />
			)}
		</div>
	);
}
