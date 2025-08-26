export type TypeCustomSection = {
	titulo: string;
	descricao: string;
};

export type TypeSection = {
	nome_secao: string;
	data: TypeCustomSection[];
	ativo: boolean;
	menu: boolean;
	en?: string;
};

export interface DataEdit {
	corporacaoAtributoID: number;
	items: TypeCustomSection[];
	chave?: string;
}
