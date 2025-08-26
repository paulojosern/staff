export interface DataTypeTicket {
	ativo: boolean;
	codigoTipoIngresso: number;
	corporacaoID: number;
	descricao: string;
	dtAlteracao: string;
	dtInclusao: string;
	formaDesconto?: string;
	idAlteracao: string;
	idInclusao: string;
	nome: string;
	snMeiaEntrada: boolean;
	tipoIngressoID: number;
	valor?: number | string;
	descricaoIngressoNome: string;
	eventosID: number;
}

export interface DatKindTicketsEvent {
	codigoTipoIngresso: number;
	deletavel?: boolean;
	descricaoIngressoNome: string;
	dtAlteracao: string;
	dtInclusao: string;

	eventosTipoIngressoID: number;
	idAlteracao: string;
	idInclusao: string;
	nome: string;
	precoUnitario: number;
	qtdeDisponivel: number;
	qtdeLimiteCpf: number;
	qtdeMaximaDisponivel: number;
	tipoIngressoID: number;
	valorFace: number;
	eventosID: number;
}
