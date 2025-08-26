export interface DataProducts {
	produtoID: number;
	tipoProdutoID?: number;
	nome: string;
	idAlteracao?: string;
	idInclusao?: string;
	ativo?: boolean;
	dtInclusao?: string;
	dtAlteracao?: string;
}

export interface DataKindsProducts {
	tipoProdutoID: number;
	nome: string;
	idAlteracao: string;
	idInclusao: string;
	dtInclusao: string;
	dtAlteracao: string;
	ativo: boolean;
}

export interface ErrorReq {
	response: {
		data: {
			message: string;
			[key: string]: string;
		};
	};
}
