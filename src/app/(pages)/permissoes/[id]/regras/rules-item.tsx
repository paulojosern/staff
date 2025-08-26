'use client';

import { useState } from 'react';
import { Funcionalidade } from '../../models';
import { Switch } from '@/components/ui/switch';
import useApi from '@/hooks/use-api';

interface PropsRules {
	item: Funcionalidade;
	perfilTelaID: number;
}

export default function RuleItem({ item, perfilTelaID }: PropsRules) {
	const [snPermissao, setSnPermissao] = useState<boolean>(item?.snPermissao);

	const handleChange = (checked: boolean) => {
		setSnPermissao(checked);
		save(checked);
	};

	const request = useApi<Funcionalidade>({
		url: '/api/PerfilFuncionalidades',
	});

	const save = async (snPermissao: boolean) => {
		if (item?.perfilFuncionalidadeID) {
			const data = {
				perfilFuncionalidadeID: item.perfilFuncionalidadeID,
				perfilTelaID,
				telasFuncionalidadeID: item.telasFuncionalidadeID,
				snPermissao,
			} as Funcionalidade;
			await request.sendRequest('put', data);
		} else {
			const data = {
				perfilTelaID,
				telasFuncionalidadeID: item.telasFuncionalidadeID,
				ativo: true,
				snPermissao,
			} as Funcionalidade;
			await request.sendRequest('post', data);
		}
	};

	return (
		<div className="flex items-center gap-3 mb-2">
			<Switch
				checked={snPermissao}
				defaultChecked={item.snPermissao}
				name="snStaff"
				onCheckedChange={(e) => handleChange(e)}
			/>
			{item.descricao}
		</div>
	);
}
