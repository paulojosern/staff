'use client';

import { useCorporation } from '@/providers/useCorporation';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { CircleAlert, Loader2, UserRoundSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { DataUserSearch } from './models';
import useDebounce from '@/hooks/useDebounce';
import api from '@/lib/api/axios';
import { Input } from '@/components/ui/input';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function UsersSearchPage() {
	const { corporation } = useCorporation();
	const [loading, setLoading] = useState(false);
	const [kind, setKind] = useState('usuario');
	const [error, setError] = useState('');
	const [data, setData] = useState<DataUserSearch[]>([]);
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 800);

	useEffect(() => {
		if (search) {
			getData(debouncedSearch as string);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, kind]);

	const getData = (text: string) => {
		setLoading(true);
		const url = `api/Search/ListPessoas?CorporacaoGuid=${
			corporation?.corporacaoGuid
		}&Search=${text}&PageStart=${0}&Rows=20&Order=1&Sort=asc&TipoUsuario=${kind}`;
		api
			.get(url)
			.then((response) => {
				setData(response.data.pessoa);
				setError('');
			})
			.catch((error) => {
				if (error.response.data.code == 404) {
					setError('Usuário não encontrado');
				} else {
					setError('Erro ao consultar -' + error.response.data.message);
				}
				setData([]);
			})
			.finally(() => setLoading(false));
	};

	return (
		<Pages
			title="Pesquisa de usuário"
			breadcrumb={dataBreadcrumb}
			icon={<UserRoundSearch />}
		>
			{/* <div className=" flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar usuário
				</Button>
			</div> */}
			<div className="mx-auto py-2 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
				<Select
					value={kind}
					onValueChange={(e) => {
						setKind(e);
					}}
				>
					<SelectTrigger className="w-full md:w-[auto]">
						<SelectValue placeholder="Select a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="usuario">Cliente</SelectItem>
							<SelectItem value="operador">Operador</SelectItem>
							<SelectItem value="administrador">Administrador</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Input
					placeholder="Search..."
					onChange={(event) => {
						// if (event.target.value === '') {
						// 	getData('');
						// }

						setSearch(event.target.value);
					}}
					className="max-w-xl"
				/>
			</div>
			{loading && (
				<div className="flex items-center  gap-2 mt-2">
					<Loader2 className="animate-spin" size={20} />
					Buscando usuário...
				</div>
			)}
			{error && (
				<div className="flex items-center  gap-2 m-2">
					<CircleAlert size={20} />
					{error}
				</div>
			)}
			<div className="mt-4">
				{!loading && data?.length > 0 && (
					<DataTable columns={columns} data={data as DataUserSearch[]} />
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(UsersSearchPage);
