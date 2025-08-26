export interface DataUserSearch {
	pessoaID: number;
	usuarioID: number;
	nome: string;
	sobrenome: string;
	login: string;
	tipoDocumento: string;
	numeroDocumento: string;
	email: string;
	tipoTelefone: string;
	ddd: string;
	numeroTelefone: string;
	dtNascimento: string;
	tipoUsuario: string;
	dtInclusao: string;
	ativo: boolean;
	corporacaoID: number;
	corporacaoNome: string;
	corporacaoGuid: string;
	subDominio: string;
	corporacaoAtivo: boolean;
	fantasia: string;
	razaoSocial: string;
	contatoPessoaJuridica: string;
}

export interface DataUserDetail {
	pessoaID: number;
	ativo: boolean;
	categoriaID: number;
	corporacao: string;
	corporacaoID: number;
	dtAlteracao: string;
	dtInclusao: string;
	idAlteracao: string;
	idInclusao: string;
	login: string;
	senha: string;
	tipoUsuario: string;
	usuarioID: number;
}

export type PessoaData = {
	pessoa: PessoaDataCurrent;
};

export type PessoaDataCurrent = {
	ativo: boolean;
	dtAlteracao: string;
	dtInclusao: string;
	idAlteracao: string;
	idInclusao: string;
	pessoaDocumento: Array<PessoaDocumentoData>;
	pessoaEmail: Array<PessoaEmailData>;
	pessoaEndereco: Array<PessoaEnderecoData>;
	pessoaFisica: PessoaFisicaData;
	pessoaJuridica: PessoaJuridicaData;
	pessoaTelefone: Array<PessoaTelefoneData>;
	state: string;
	tipoPessoa: string;
	pessoaID: number;
};

export type PessoaFisicaData = {
	id: number;
	pessoaFisicaID: number;
	nome: string;
	sobrenome: string;
	dtNascimento: string;
	sexo: string;
	estadoCivil: string;
	state: string;
	nacionalidade: string;
};

interface PessoaJuridicaData {
	contato: string;
	fantasia: string;
	id: number;

	pessoaJuridicaID: number;
	razaoSocial: string;
	state: string;
}

export type PessoaEnderecoData = {
	pessoaEnderecoID: number;
	cep: string;
	logradouro: string;
	numero: number;
	complemento: string;
	bairro: string;
	cidade: string;
	uf: string;
	prioridade: number;
	observacoes: string;
	tipoEndereco: string;
	dtInclusao: string;
	dtAlteracao: string;
	idInclusao: string;
	idAlteracao: string;
	ativo: boolean;
	state: string;
	pessoaID: number;
	nomeEndereco: string;
};

export type PessoaDocumentoData = {
	pessoaDocumentoID: number;
	tipoDocumento: string;
	numero: string;
	dtInclusao: string;
	dtAlteracao: string;
	idInclusao: string;
	idAlteracao: string;
	ativo: boolean;
	state: string;
	pessoaID: number;
};

export type PessoaTelefoneData = {
	pessoaTelefoneID: number;
	tipoTelefone: string;
	ddi: string;
	ddd: string;
	numero: string;
	prioridade: number;
	optin: true;
	optinSMS: true;
	dtInclusao: string;
	dtAlteracao: string;
	idInclusao: string;
	idAlteracao: string;
	ativo: boolean;
	state: string;
	pessoaID: number;
};

export type PessoaEmailData = {
	pessoaEmailID: number;
	tipoEmail: string;
	email: string;
	prioridade: number;
	optin: boolean;
	dtInclusao: string;
	dtAlteracao: string;
	idInclusao: string;
	idAlteracao: string;
	ativo: boolean;
	state: string;
	pessoaID: number;
};
