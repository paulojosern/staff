export interface Dominio {
	nomeTela: string;
	codigoTela: string;
	descricaoTela: string;
	patchTela: string;
	menuTela: string;
	ativo: boolean;
	dtCriacao: string;
	dtUltimaAlteracao: string;
	idInclusao: string;
	telaID: number;
}

export interface Funcionalidade {
	telasFuncionalidadeID: number;
	telaID: number;
	funcionalidade: string;
	descricao: string;
	ativo: boolean;
	idInclusao: string;
	idAlteracao: string;
	perfilFuncionalidadeID: number;
	perfilTelaID: number;
	snPermissao: boolean;
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

export interface ProfileDomain {
	permissaoPerfilID: number;
	telaID: number;
	ativo: boolean;
	idInclusao: string;
	perfilTelaID: number;
}

export interface ProfileRules {
	perfilFuncionalidadeID: number;
	perfilTelaID: number;
	telasFuncionalidadeID: number;
	snPermissao: boolean;
	ativo: boolean;
	idAlteracao: string;
}

export interface UserProfileRules {
	usuarioPerfilID: number;
	usuarioID: number;
	corporacaoID: number;
	permissaoGrupoID: number;
	permissaoPerfilID: number;
	ativo: boolean;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;

	nomeGrupo: string;
	nomePerfil: string;
	descricaoPerfil: string;
}
