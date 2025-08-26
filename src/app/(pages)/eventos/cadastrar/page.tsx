'use client';

import { useCorporation } from '@/providers/useCorporation';
import Pages from '@/theme/pages';
import { Calendar, CirclePlus, Loader2 } from 'lucide-react';
import { DataEvents, Datalocation } from '../models';
import { FormData } from '../form';
import { DataProducts } from '../../produtos/models';
import useApiList from '@/hooks/use-api-list';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
	{
		title: 'Eventos',
		url: '/eventos',
	},
];

export default function RegisterEvent() {
	const { corporation } = useCorporation();
	const [model, setModel] = useState<DataEvents>();
	const products = useApiList<DataProducts[]>({
		url: `/api/Produto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&TipoProdutoID=0`,
		fetcher: !!corporation,
	});

	const location = useApiList<[]>({
		url: `/api/EventosLocalizacao/List?CorporacaoID=${corporation?.corporacaoID}`,
		fetcher: !!corporation,
	});

	const models = useApiList<DataEvents[]>({
		url: `/api/ModeloEvento/List?CorporacaoGuid=${corporation?.corporacaoGuid}&CorporacaoId=${corporation?.corporacaoID}&ProdutoID=0`,
		fetcher: !!corporation,
	});

	if (products.isLoading || location.isLoading || models.isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin" size={40} />
			</div>
		);
	}

	return (
		<Pages title="Novo Evento" breadcrumb={dataBreadcrumb} icon={<Calendar />}>
			{!model && models.response && models.response?.length > 0 && (
				<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
					<div className=" rounded-lg border p-4 mt-4">
						<div className="text-base mb-4">
							Selecione um modelo de evento para usar como base no novo evento.
						</div>

						<Select
							onValueChange={(e) => {
								const event = models?.response?.find(
									(event) => event.modeloEventoID.toString() === e
								) as DataEvents;

								const {
									descricaoEvento,
									descricaoSetor,
									eventosLocalizacaoID,
									imagemEvento,
									localEvento,
									nomeEvento,
									nomeSetor,
									produtoID,
									subTituloPDV,
									tipoTicket,
									tipoControleAcesso,
									tipoLeituraQrCode,
									tituloPDV,
								} = event;

								setModel({
									nome: nomeEvento,
									descricao: descricaoEvento,
									descricaoSetor,
									eventosLocalizacaoID,
									imagemEvento,
									localEvento,
									nomeEvento,
									nomeSetor,
									produtoID,
									tituloPDV,
									subTituloPDV,
									tipoTicket,
									tipoControleAcesso,
									tipoLeituraQrCode,
									dataEvento: new Date().toISOString().split('T')[0],
									dataInicio: new Date().toISOString().split('T')[0],
									dataFim: new Date().toISOString().split('T')[0],
								} as DataEvents);
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Modelos de evento" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{models.response.map((model) => (
										<SelectItem
											key={model.modeloEventoID}
											value={model.modeloEventoID.toString()}
										>
											{model.nomeModelo}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className=" rounded-lg border p-4 mt-4">
						<div className="text-base mb-4">
							Clique abaixo para criar um evento totalmente novo.
						</div>
						<Button
							variant="secondary"
							onClick={() => setModel({} as DataEvents)}
						>
							<CirclePlus />
							Novo evento
						</Button>
					</div>
				</div>
			)}
			{model && (
				<FormData
					products={products.response as DataProducts[]}
					location={(location.response as Datalocation[]) || []}
					item={model}
				/>
			)}
		</Pages>
	);
}
