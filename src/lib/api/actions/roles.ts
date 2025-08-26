'use server';

import api from '../axios';

interface DataPermission {
	perfilTelaID: number;
	telaID: number;
	codigoTela: string;
	funcionalidades: {
		funcionalidade: string;
		snPermissao: boolean;
	}[];
}

interface DataGroup {
	perfilTelaID: number;
	telaID: number;
	codigoTela: string;
	funcionalidades: string[];
}

interface PropsUserProfile {
	permissaoPerfilID: number;
	ativo: boolean;
}

export async function getUserRoles(
	userProfile: PropsUserProfile[],
	accessToken: string
) {
	const permissions: DataPermission[] = [];
	const group: DataGroup[] = [];

	const results = await Promise.all(
		userProfile.map((item) => {
			return api.get(
				`/api/PermissaoPerfil/ListTelasFuncionalidades?PermissaoPerfilID=${item.permissaoPerfilID}`,
				{
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				}
			);
		})
	);

	results.forEach((res) =>
		res?.data[0]?.telas?.forEach((item: DataPermission) => {
			permissions.push(item);
		})
	);

	permissions.forEach((item: DataPermission) => {
		if (group.some((i) => i.codigoTela === item.codigoTela)) {
			group.forEach((g) => {
				if (g.codigoTela === item.codigoTela) {
					g.funcionalidades = [
						...g.funcionalidades,
						...item.funcionalidades?.map((i) => i.funcionalidade),
					];
				}
			});
		} else {
			group.push({
				...item,
				funcionalidades: item.funcionalidades?.map((i) => i.funcionalidade),
			});
		}
	});

	return group.reduce(
		(obj, item) => ({
			...obj,
			[item['codigoTela']]: item,
		}),
		{}
	);
}
