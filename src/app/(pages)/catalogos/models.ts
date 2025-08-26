export interface DataCatalog {
	catalogoID: number;
	nome: string;
	ativo: boolean;
	corporacaoID: number;
	tipoCatalogo: number;
	titulo: string;
	sobre: string;
	prioridade: number;
	dataInicioVigencia: string;
	dataFimVigencia: string;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}

export interface DataCatalogProduct {
	catalogoProdutoID: number;
	catalogoID: number;
	produtoID: number;
	ativo: boolean;
	titulo: string;
	sobre: string;
	snPermiteTaxa: boolean;
	snPermiteCupom: boolean;
	snLimitaporCPF: boolean;
	snCatalogoExterno: boolean;
	permiteBoleto: boolean;
	permiteMeiaEntrada: boolean;
	qtdeMaximaDisponivel: number;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
	deletavel?: boolean;
	snVendaCondicionada: boolean;
	tipoCatalogo: string;
	termoCompra: string;
}

export interface DataCatalogProductTax {
	catalogoProdutoTaxaID: number;
	catalogoProdutoID: number;
	ativo: boolean;
	nome: string;
	tipoTaxa: number;
	taxaPercentual: number;
	taxaFixa: number;
	snVisivelCompra: boolean;
	descricao: string;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}
export interface DataCatalogProductEvent {
	catalogoProdutoEventoID: number;
	catalogoProdutoID: number;
	ativo: boolean;
	eventosID: number;
	vendaLiberada: boolean;
	invisivel: boolean;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
	vendaEncerrada: boolean;
	vendaOculta: boolean;
	nome: string;
	dataEvento: string;
	dataInicio: string;
	dataFim: string;
}

export interface DataCatalogProductImage {
	catalogoProdutoImagemID: number;
	catalogoProdutoID: number;
	imagemPrincipal: string;
	extensaoImgPrincipal: string;
	imagemDois: string;
	extensaoImgDois: string;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}

export interface DataProductsStore {
	ativo: boolean;
	catalogoProdutoCondicaoID: number;
	catalogoProdutoID: number;
	categoriaCondicao: number;
	cor: string;
	deletavel: boolean;
	descricao: string;
	dtAlteracao: string;
	dtInclusao: string;
	eventosLocalizacaoID: number;
	idAlteracao: string;
	idInclusao: string;
	imagemCondicao: string;
	localCondicao: string;
	nome: string;
	qtdeCondicao: number;
	snCatalogoPromocional: boolean;
	tamanho: string;
	valor: number;
}

export interface DataTax {
	catalogoProdutoTaxaID: number;
	catalogoProdutoID: number;
	ativo: boolean;
	nome: string;
	tipoTaxa: string;
	taxaPercentual: number;
	taxaFixa: number;
	snVisivelCompra: boolean;
	descricao: string;
	snHabilita_Corporativo: boolean;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
	deletavel: boolean;
}

export interface DataCatalogProductEvent {
	catalogoProdutoEventoID: number;
	catalogoProdutoID: number;
	ativo: boolean;
	eventosID: number;
	vendaLiberada: boolean;
	invisivel: boolean;
	idInclusao: string;
	dtInclusao: string;
	idAlteracao: string;
	dtAlteracao: string;
}
