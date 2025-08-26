export interface Data {
	home: LayoutHome;
	rodape: LayoutRodape;
	maps: LayoutMaps;
	secoes: LayoutSections;
}

export interface LayoutHome {
	order: number;
	tema: string;
	tipo: string;
	layout_descricao: string;
	layout_subtitulo: string;
	seo_image: string;
	seo_favicon: string;
	seo_title: string;
	seo_description: string;
	mostrar_opcoes: boolean;
	layout_descricao_en: string;
	menu_ingressos: string;
	en: string;
	texto_venda: string;
}

export interface LayoutRodape {
	order: number;
	endereco: string;
	atendimento: string;
	contato: string;
	instagram: string;
	whatsapp: string;
	copyright: string;
	facebook: string;
	twitter: string;
}

export interface LayoutSections {
	nome: string;
	uuid: string;
	order: number;
}

export interface LayoutMaps {
	order: number;
	latitude: string;
	longitude: string;
	zoom: number;
	edit: boolean;

	nome: string;

	uuid: string;
}

export interface DataGeneric {
	order: number;
	uuid: string;
	edit: boolean;
	id: string;
	nome: string;
	desktop: DataGenericImg;
	mobile: DataGenericImg;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface DataGenericImg {
	alt: string;
	center: boolean;
	fullwidth: boolean;
	public_id: string;
	spacebottom: string;
	spacetop: string;
	link: string;
}
