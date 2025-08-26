'use client';

import api from '@/lib/api/axios';
import { ReactNode, useContext, useState, createContext } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';

export interface DataCorporation {
	corporacaoAtivo: true;
	corporacaoGuid: string;
	corporacaoID: number;
	corporacaoNome: string;
	ddd: string;
	dtInclusao: string;
	dtNascimento: string;
	email: string;
	login: string;
	nome: string;
	numeroDocumento: string;
	numeroTelefone: string;
	pessoaID: number;
	sobrenome: string;
	tipoDocumento: string;
	tipoTelefone: string;
	tipoUsuario: string;
	usuarioID: number;
	subDominio?: string;

	imagemLogo: string;
	extensaoImgLogo: string;
	imagemLogoDois: string;
	dtAlteracao: string;
	idInclusao: string;
	idAlteracao: string;

	guid: string;

	extensaoImgLogoDois: string;
	corPrimaria: string;
	corSecundaria: string;
	imagemSeo: string;
	tituloImagemSeo: string;
	descricaoImagemSeo: string;
	ativo: boolean;

	snModuloIngressos: boolean;
	snModuloAcessos: boolean;
	snSplit_Pagseguro: boolean;
	snLoja: boolean;
	snProgramaSocioTorcedor: boolean;
	snProgramaSocioClube: boolean;
	dominio: string;
	deletavel: boolean;
	sdl: boolean;
	PagSeguroAPI: 'Transaction' | 'Orders';
}

type ContextType = {
	corporation: DataCorporation | null;
	addCorporation: (corporation: DataCorporation) => void;
};

const CorporationContext = createContext<ContextType>({} as ContextType);

export function CorporationProvider({ children }: { children: ReactNode }) {
	const [corporation, setCorporation] = useState<DataCorporation | null>(null);

	function addCorporation(corporation: DataCorporation) {
		getCorporation(corporation);
	}

	const getCorporation = async (corporation: DataCorporation) =>
		await api
			.get<DataCorporation[]>(
				`/api/Search/ListCorporacao?SubDominio=${corporation.subDominio}`
			)
			.then((response) => {
				setCorporation({
					...response.data[0],
					...corporation,
					sdl: corporation.corporacaoID === 1,
				});
			})
			.catch(() => {
				toast.custom((t) => (
					<Toaster
						t={t}
						type="error"
						description={'Erro ao buscar corporação.'}
					/>
				));
			});

	return (
		<CorporationContext.Provider value={{ corporation, addCorporation }}>
			{children}
		</CorporationContext.Provider>
	);
}

export const useCorporation = () => useContext(CorporationContext);
