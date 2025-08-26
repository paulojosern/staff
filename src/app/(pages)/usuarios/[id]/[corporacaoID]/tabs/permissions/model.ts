export interface DataUserPermissions {
	usuarioPerfilID: number;
	usuarioID: number;
	corporacaoID: number;
	permissaoGrupoID: number;
	nomeGrupo: string;
	permissaoPerfilID: number;
	nomePerfil: string;
	descricaoPerfil: string;
	ativo: boolean;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}

export interface Group {
	nomeGrupo: string;
	descricaoGrupo: string;
	corporacaoID: number;
	ativo: boolean;
	idInclusao: string;
	permissaoGrupoID: number;
	idAlteracao: string;
}

export interface Profile {
	tipoUsuario: string;
	permissaoGrupoID: number;
	nomePerfil: string;
	descricaoPerfil: string;
	ativo: boolean;
	idInclusao: string;
	permissaoPerfilID: number;
}
