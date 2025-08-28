export interface DataAllocation {
	eventosStaffID: number;
	nome: string;
	dataInicio: string;
	zona: string;
	funcao: string;
	resumoAlocacoes: DataAllocationResume[];
}

export interface DataAllocationResume {
	nomeProdutor: string;
	produtoresAlocados: number;
	prestadoresAlocados: number;
}

export interface DataAllocationItem {
	eventosStaffPrestadoresID: number;
	eventosStaffID: number;
	produtorID: number;
	nomeProdutor: string;
	docProdutor: string;
	usuarioProdutor: number;
	prestadorID: string;
	nomePrestador: string;
	documentoPrestador: string;
	usuarioPrestador: number;
	ativo: boolean;
	credencial: string;
	dataGeracaoCredencial: string;
	dataInicioValidade: string;
	dataFimValidade: string;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}

export interface DataListAlocation {
	ativo: boolean;
	credencial: string;
	dataFimValidade: string;
	dataGeracaoCredencial: string;
	dataInicioValidade: string;
	docProdutor: string;
	documentoPrestador: string;
	dtAcesso: string;
	dtAcessoSaida: string;
	dtAlteracao: string;
	dtInclusao: string;
	dtPrimeiraEmissao: string;
	dtUltimaEmissao: string;
	eventosStaffID: number;
	eventosStaffPrestadoresID: number;
	idAlteracao: string;
	idInclusao: string;
	idOperadorAcesso: number;
	idOperadorAcessoSaida: string;
	idOperadorEmissao: string;
	nomePrestador: string;
	nomeProdutor: string;
	prestadorID: string;
	produtorID: number;
	qtdeEmissoes: number;
	snEmitiu: boolean;
	statusCredencial: string;
	usuarioPrestador: number;
	usuarioProdutor: number;
}

export interface DataPrestadoresListStaff {
	prestadorID: number;
	pessoaID: number;
	tipoPessoa: string;
	usuarioID: number;
	corporacaoID: number;
	nomePrestador: string;
	documentoPrestador: string;
	tipoPrestador: string;
	ativo: boolean;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}

export interface DataPrestadoresUserStaff {
	eventosStaffPrestadoresID: number;
	evento: string;
	produtor: string;
	prestador: string;
	zona: string;
	funcao: string;
	credencial: string;
	statusCredencial: string;
	dataInicioValidade: string;
	dataFimValidade: string;
	dataGeracaoCredencial: string;
}
