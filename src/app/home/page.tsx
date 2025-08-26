'use client';

// import { useToast } from '@/providers/ToastContext';
// import { useAuth } from '@/providers/useAuth';
import { useCorporation } from '@/providers/useCorporation';
import AuthGuard from '@/services/guard/authGuard';
import Base from '@/theme/base';
// import { useEffect } from 'react';
import {
	Calendar1,
	DollarSign,
	ShieldPlus,
	ShoppingCart,
	Ticket,
	Users,
} from 'lucide-react';
import Widget from './widget';
import { Calendar } from '@/components/ui/calendar';

// import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
// import { Toaster } from '@/components/ui/toaster';
import api from '@/lib/api/axios';

const payload = {
	corporacaoID: 1,
	nome: 'Sou da Liga',
	dtInclusao: '2021-01-26T19:47:02.6833333',
	dtAlteracao: '2025-06-18T19:47:20.8333333',
	idInclusao: '1',
	idAlteracao: '207588',
	ativo: true,
	guid: 'c7729a46-2bb1-480c-8335-b28a3aac9913',
	extensaoImgLogo: null,
	imagemLogoDois: null,
	extensaoImgLogoDois: null,
	corPrimaria: '#ea410a',
	corSecundaria: '#4177d9',
	snModuloIngressos: false,
	snModuloAcessos: false,
	subDominio: 'soudaliga',
	imagemSeo: null,
	tituloImagemSeo: null,
	descricaoImagemSeo: null,
	snSplit_Pagseguro: false,
	snLoja: false,
	snProgramaSocioTorcedor: false,
	snProgramaSocioClube: false,
	dominio: 'SoudaLiga',
	deletavel: false,
};

function HomePage() {
	// const { getRolesByPage } = useAuth();
	const { corporation } = useCorporation();

	const date = [new Date('2025/05/17'), new Date('2025/05/18')];

	const handleDateChange = (value: Date[] | undefined) => {
		console.log(value);
	};
	console.log(corporation);

	const getDel = async () => {
		//207588 //4
		// const url = `/api/UsuarioMFA?UsuarioID=9&Tipo=TokenAuth`;
		// await api.delete(url).then((response) => {
		// 	toast.custom((t) => (
		// 		<Toaster
		// 			t={t}
		// 			type="success"
		// 			description="Corporação aberta com sucesso"
		// 		/>
		// 	));
		// 	console.log(response.data);
		// });
		const url = `/api/Corporacao`;
		await api
			.put(url, payload)
			.then((response) => {
				console.log(response.data);
				//changeAcess(response.data[0]);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// const changeAcess = async (data: any) => {
	// 	await api
	// 		.put(`/api/CorporacaoMFA`, {
	// 			...data,
	// 			obrigatorio: false,
	// 			idAlteracao: data.idInclusao,
	// 		})
	// 		.then((response) => {
	// 			console.log(response.data);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	return (
		<Base>
			<div className="space-y-4 mb-4">
				<h1>{corporation?.corporacaoNome}</h1>
			</div>
			<Button
				onClick={() => {
					getDel();
				}}
			>
				abrir
			</Button>

			{corporation?.sdl && (
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<Widget
						url={`/api/BI/Dash/DashCorporacoes?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="totalCorporacoes"
						icon={<ShieldPlus size={25} />}
						title="Total de Corporações"
						description="Todas corporaçoes cadastradas"
						link="/informacoes-corporacoes"
					/>
					<Widget
						url={`/api/BI/Dash/DashCorporacoes?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="clientesCadastrados"
						icon={<Users size={25} />}
						description="Em todas as corporaçoes"
						title="Clientes cadastrados"
					/>
					<Widget
						url={`api/BI/Dash/DashTotalDeVendas?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="quantidadeTotal"
						icon={<ShoppingCart size={25} />}
						title="Total de vendas"
						description="Pedidos pagos"
					/>
					<Widget
						url={`api/BI/Dash/DashTotalDeIngressos?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="quantidadeTotal"
						icon={<Ticket size={25} />}
						title="Total de ingressos"
						description="Todos os ingressos emitidos e pagos"
					/>

					<Widget
						url={`/api/BI/Dash/DashCorporacoes?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="totalEventosGeral"
						icon={<Calendar1 size={25} />}
						title="Total de eventos cadastrados"
						description="Eventos e jogos"
					/>
					<Widget
						url={`/api/BI/Dash/DashCorporacoes?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="valorTotalGeral"
						icon={<DollarSign size={25} />}
						title="Valor total Arrecadado"
						description="Arrecadação"
						currency
					/>
				</div>
			)}

			{!corporation?.sdl && (
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<Widget
						url={`/api/BI/Dash/DashClientesCadastrados?CorporacaoGuid=${corporation?.corporacaoGuid}&TipoUsuario=Usuario`}
						path="quantidadeTotal"
						icon={<Users size={25} />}
						title="Clientes cadastrados"
					/>
					<Widget
						url={`api/BI/Dash/DashTotalDeVendas?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="quantidadeTotal"
						icon={<ShoppingCart size={25} />}
						title="Total de vendas"
						description="Pedidos pagos"
					/>
					<Widget
						url={`api/BI/Dash/DashTotalDeIngressos?CorporacaoGuid=${corporation?.corporacaoGuid}`}
						path="quantidadeTotal"
						icon={<Ticket size={25} />}
						title="Total de ingressos"
						description="Todos os ingressos emitidos e pagos"
					/>
				</div>
			)}

			<Calendar
				mode="multiple"
				selected={date}
				onSelect={handleDateChange}
				className="rounded-lg border p-8  mb-4  mt-4"
			/>
		</Base>
	);
}

export default AuthGuard(HomePage);
