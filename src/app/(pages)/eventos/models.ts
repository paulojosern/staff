export interface DataEvents {
	eventosID: number;
	id: number;
	dataEvento: string;
	dataInicio: string;
	dataFim: string;
	nome: string;
	descricao: string;
	qtdeDisponivelInteira: number;
	valorInteira: number;
	qtdeLimiteCpf: number;
	qtdeDisponivelMeiaEntrada: number;
	valorMeiaEntrada: number;
	qtdeLimiteMeiaCpf: number;
	corporacaoID: number;
	modeloEventoID: number;
	eventosIDX: string;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
	editavel: boolean;
	ativo: boolean;
	tagsEvento: string;
	nomeEvento: string;
	invisivel: boolean;
	vendaLiberada: boolean;
	vendaEncerrada: boolean;
	catalogoProduto: string;
	nomeModelo: string;
	descricaoSetor: string;

	eventosLocalizacaoID: number;

	imagemEvento: string;
	localEvento: string;

	nomeSetor: string;
	produtoID: number;
	qtdeMaximaDisponivel: number;
	snBeneficiarioAutomatico: false;
	snDemonstraBeneficiario: false;
	snInfoAdicionalBeneficiario: false;
	snPacoteAnual: false;
	snStaff: false;
	sobreEvento: string;
	subTituloPDV: string;
	tipoControleAcesso: string;
	tipoLeituraQrCode: string;
	tituloPDV: string;

	deletavel: boolean;
	descricaoEvento: string;

	tipoTicket: string;
}

export interface DataSectores {
	nomeSetor: string;
	descricaoSetor: string;
	subTituloPDV: string;
	tituloPDV: string;
	eventosID: number;
}

export interface Datalocation {
	eventosLocalizacaoID: number;
	corporacaoID: number;
	nome: string;
	apelido: string;
	nomeCompleto: string;
	uf: string;
	imagemLocalizacao: string;
	alvara: string;
	ativo: boolean;
	googleMaps: string;
	idInclusao: string;
	slug: string;
}

export const tipoControleAcesso = {
	NaoTem: 'Não tem',
	CheckIn: 'CheckIn',
	CheckInCheckOut: 'CkeckIn e CheckOut',
	Leads: 'Leads',
};

export const tipoLeituraQCode = {
	NaoTem: 'Não tem',
	UnicoAcesso: 'Uníco acesso',
	PermiteAcessos: 'Permite acessos',
};

export interface ObjectGeneric {
	[key: string]: string;
}

export interface DataInformationList {
	ativo: boolean;
	dtAlteracao: string;
	dtInclusao: string;
	eventosID: number;
	eventosTipoInfoBeneficiarioID: number;
	idAlteracao: string;
	idInclusao: string;
	tipoInformacaoBeneficiarioID: string;
	valorInfoAdicional: string;
}

export interface DataInformationForm {
	title: string;
	form: DataInformationItem[];
	required?: boolean;
}

export interface DataInformationItem {
	id: number;
	name: string;
	type: string;
	option?: {
		id: number;
		label: string;
		nome?: string;
	}[];
	externalList: boolean;
	required: boolean;
	value?: string;
	nomeBeneficiario?: boolean;
	cpfBeneficiario?: boolean;
}

export interface DataInformation {
	information: string;
	data: DataInformationForm | string;
	active?: boolean;

	eventosTipoInfoBeneficiarioID?: number;
}
