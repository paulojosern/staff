'use client';

// import { useCorporation } from '@/providers/useCorporation';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { User } from 'lucide-react';
import { use } from 'react';

import useFetch from '@/lib/api/swr';
import { DataUserDetail, PessoaData } from '../../models';
import { formatDate } from '@/utils/formats';

import { Switch } from '@/components/ui/switch';
import ResponsiveTabs from './tabs';
import { KeyedMutator } from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
// import { useCorporation } from '@/providers/useCorporation';

const Status = {
	usuario: 'Cliente',
	administrador: 'Administrador',
	operador: 'Operador',
	parceiro: 'Parceiro',
} as {
	[key: string]: string;
};

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
	{
		title: 'Usuários',
		url: '/usuarios',
	},
];

interface Props {
	params: Promise<{ id: string; corporacaoID: string }>;
}

function UserDetail({ params }: Props) {
	const { id, corporacaoID } = use(params);

	const url = `api/Usuario/GetLoginOrPessoaID?PessoaID=${id}&CorporacaoID=${corporacaoID}`;
	const { data } = useFetch<DataUserDetail>(url);
	const userSearch = data as DataUserDetail;

	const urlPessoa = `api/Pessoa/Get?PessoaID=${id}`;
	const { data: pessoa, mutate } = useFetch<PessoaData>(urlPessoa);
	const userData = (pessoa as PessoaData)?.pessoa;

	const tipoUsuario = userSearch?.tipoUsuario?.toLowerCase();

	return (
		<Pages
			title={
				!userData ? (
					<Skeleton className="w-[200px] h-[20px] rounded-full" />
				) : (
					`${userData?.pessoaFisica?.nome}  ${userData?.pessoaFisica?.sobrenome}`
				)
			}
			breadcrumb={dataBreadcrumb}
			icon={<User />}
		>
			<div className=" flex flex-wrap gap-3 md:gap-4 w-full gap-2 border-b pb-4 mb-2 mt-2 items-center">
				<div className="flex items-center gap-3   text-sm md:text-base">
					Ativo
					<Switch
						checked={userSearch?.ativo}
						name="snLimitaporCPF"
						// onCheckedChange={(e) => handleChange('snLimitaporCPF', e)}
					/>
				</div>
				<div className="flex items-center gap-2 border border-solid border-[#ccc] rounded-full py-1 px-3 text-sm md:text-base">
					{tipoUsuario && Status[tipoUsuario]}
				</div>
				{userSearch?.dtInclusao && (
					<div className="flex items-center gap-2 text-xs md:text-sm  opacity-80 flex-100%">
						Criado em {formatDate(userSearch?.dtInclusao)}
					</div>
				)}
			</div>
			<ResponsiveTabs
				userSearch={userSearch}
				pessoa={userData}
				mutate={mutate as KeyedMutator<unknown>}
			/>
		</Pages>
	);
}

export default AuthGuard(UserDetail);
