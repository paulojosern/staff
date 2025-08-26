'use client';

import useFetch from '@/lib/api/swr';
import { useEffect, useState } from 'react';
import { Funcionalidade } from '../../models';
import api from '@/lib/api/axios';
import RuleItem from './rules-item';

interface Props {
	telaID: number;
	perfilTelaID: number;
}

export default function PermissionsListRules({ telaID, perfilTelaID }: Props) {
	const url = `api/telasFuncionalidades/List?telaID=${telaID}`;
	const { data } = useFetch<Funcionalidade[]>(url);
	const [list, setList] = useState<Funcionalidade[]>();

	useEffect(() => {
		getRules(perfilTelaID, data as Funcionalidade[]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const getRules = async (perfilTelaID: number, list: Funcionalidade[]) => {
		const url = `api/PerfilFuncionalidades/List?PerfilTelaID=${perfilTelaID}`;
		await api
			.get(url)
			.then((response) => {
				const items: Funcionalidade[] = list.map((item) => ({
					...item,
					perfilFuncionalidadeID: response.data.find(
						(i: Funcionalidade) =>
							item.telasFuncionalidadeID === i.telasFuncionalidadeID
					)?.perfilFuncionalidadeID,
					snPermissao: response.data.find(
						(i: Funcionalidade) =>
							item.telasFuncionalidadeID === i.telasFuncionalidadeID
					)?.snPermissao,
				}));

				setList(items);
			})
			.catch(() => {
				setList(list);
			});
	};

	return (
		<div className="mb-2 mt-2">
			{list?.map((item) => (
				<RuleItem
					key={item.telasFuncionalidadeID}
					item={item}
					perfilTelaID={perfilTelaID}
				/>
			))}
		</div>
	);
}
