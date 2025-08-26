export interface DataCupom {
	ativo: boolean;
	cupomID: number;
	codigoPromocional: string;
	corporacaoID: number;
	dataExclusao: string;
	dataFim: string;
	dataInicio: string;
	descricao: string;
	dtAlteracao: string;
	dtInclusao: string;
	formaDesconto: number | string;
	idAlteracao: string;
	idInclusao: string;
	valor: number;
	deletavel?: boolean;
	snCupomCondicionado: boolean;
	quantidadeMaxima: number;
	tipoCupomID: string;
}
