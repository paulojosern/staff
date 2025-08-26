'use client';
import { use, useState } from 'react';
import { Dominio, Profile, ProfileDomain } from '../../models';
import useFetch from '@/lib/api/swr';
import ResponsiveTabs from './tabs';
import Pages from '@/theme/pages';
import { Button } from '@/components/ui/button';
import { FiPlus } from 'react-icons/fi';
import { Lock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCorporation } from '@/providers/useCorporation';

const FormDomain = dynamic(() => import('./form-domain'), {
	ssr: false,
});

interface Props {
	params: Promise<{ id: string }>;
}

export default function Rules({ params }: Props) {
	const { corporation } = useCorporation();
	const { id } = use(params);
	const [open, setOpen] = useState(false);

	const url = `api/PerfilTelas/list?PermissaoPerfilID=${id}`;
	const { data: rules, mutate } = useFetch<ProfileDomain[]>(url);

	const urlProfile = `api/PermissaoPerfil?PermissaoPerfilID=${id}`;
	const { data } = useFetch<Profile>(urlProfile);

	const urlList = `api/Telas/list`;
	const { data: list } = useFetch<Dominio[]>(urlList);

	const dataBreadcrumb = [
		{
			title: 'Home',
			url: '/home',
		},
		{
			title: 'Permissões',
			url: '/permissoes/' + corporation?.corporacaoID,
		},
	];

	return (
		<Pages
			title="Regras de permissões"
			breadcrumb={dataBreadcrumb}
			icon={<Lock />}
		>
			{open && (
				<FormDomain
					open={open}
					setOpen={setOpen}
					mutate={mutate}
					domains={list as Dominio[]}
					permissaoPerfilID={Number(id)}
				/>
			)}
			{data && (
				<div className="border-b-1 pb-3 pt-2 mb-4">
					<div className="font-medium text-xl">
						{(data as Profile)?.nomePerfil}
					</div>
					<div>{(data as Profile)?.descricaoPerfil}</div>
				</div>
			)}
			<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				<Button
					onClick={() => {
						setOpen(true);
					}}
					variant="default"
				>
					Adicionar novo domínio <FiPlus />
				</Button>
			</div>
			<div className="mx-auto py-2">
				{rules?.length && (
					<ResponsiveTabs menuItems={rules} list={list as Dominio[]} />
				)}
			</div>
		</Pages>
	);
}
