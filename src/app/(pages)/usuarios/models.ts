export type DataUserCreate = {
	pessoaID: number;
	tipoUsuario: string;
	login: string;
	senha: string;
	corporacaoGuid?: string;
};
