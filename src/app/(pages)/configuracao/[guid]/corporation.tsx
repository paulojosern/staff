import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useApi from '@/hooks/use-api';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { DataCorporation } from '@/providers/useCorporation';
import { useState } from 'react';

interface Data {
	nome: string;
	subDominio: string;
	ativo: boolean;
	snModuloAcessos: boolean;
	snModuloIngressos: boolean;
	snLoja: boolean;
	snSplit_Pagseguro: boolean;
	snProgramaSocioTorcedor: boolean;
	snProgramaSocioClube: boolean;
}

interface Props {
	corporation: DataCorporation;
}
export default function Corporation({ corporation }: Props) {
	const confirmationDialog = useConfirmationDialog();
	const [values, setValues] = useState<Data>(corporation as Data);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	};

	const handleInput = (name: string, value: boolean) => {
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	};

	const { sendRequest } = useApi<DataCorporation>({
		url: '/api/corporacao',
	});

	const onSubmit = async () => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  alterar`,
				confirmText: `Sim, alterar`,
				cancelText: 'Não, cancelar',
			});

			save();
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

	async function save() {
		await sendRequest(
			'put',
			{ ...corporation, ...values },
			'',
			corporation.corporacaoID
		);
	}

	return (
		<div className="flex flex-col">
			<ConfirmationDialog hook={confirmationDialog} />
			<div className="flex-1 space-y-2">
				<span className="text-md font-medium text-muted-foreground leading-relaxed text-center md:text-left border rounded-md p-2 px-4 mb-2 inline-block">
					{corporation?.guid}
				</span>
				<div className="py-2 flex flex-col md:grid md:grid-cols-[500_250] gap-4 mb-4">
					<div>
						<Label className="p-1 text-sm" htmlFor="nome">
							Nome
						</Label>
						<Input
							type="text"
							value={values?.nome}
							onInput={handleInputChange}
							name="nome"
						/>
					</div>
					<div>
						<Label className="p-1 text-sm" htmlFor="subDominio">
							Sub-Domínio
						</Label>
						<Input
							type="text"
							value={values?.subDominio}
							onInput={handleInputChange}
							name="subDominio"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2 md:grid md:grid-cols-[1fr_1fr_1fr_1fr] md:gap-4">
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between  ">
						<div>
							<div className="text-base font-medium">Ativo</div>
							<p className="text-sm text-muted-foreground ">
								Habilita a corporação
							</p>
						</div>
						<Switch
							checked={values?.ativo}
							name="ativo"
							onCheckedChange={(e) => handleInput('ativo', e)}
						/>
					</div>

					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">Acessos</div>
							<p className="text-sm text-muted-foreground  ">
								Habilita módulo acessos
							</p>
						</div>
						<Switch
							checked={values?.snModuloAcessos}
							name="snModuloAcessos"
							onCheckedChange={(e) => handleInput('snModuloAcessos', e)}
						/>
					</div>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">Ingressos</div>
							<p className="text-sm text-muted-foreground ">
								Habilita módulo ingressos
							</p>
						</div>
						<Switch
							name="snModuloIngressos"
							checked={values?.snModuloIngressos}
							onCheckedChange={(e) => handleInput('snModuloIngressos', e)}
						/>
					</div>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">loja</div>
							<p className="text-sm text-muted-foreground ">
								Habilita módulo loja de produtos
							</p>
						</div>
						<Switch
							name="snLoja"
							checked={values?.snLoja}
							onCheckedChange={(e) => handleInput('snLoja', e)}
						/>
					</div>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">PagSeguro</div>
							<p className="text-sm text-muted-foreground ">
								Habilita módulo pagseguro
							</p>
						</div>
						<Switch
							name="snSplit_Pagseguro"
							checked={values?.snSplit_Pagseguro}
							onCheckedChange={(e) => handleInput('snSplit_Pagseguro', e)}
						/>
					</div>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">Sócio Torcedor</div>
							<p className="text-sm text-muted-foreground ">
								Integração com Fiel Torcedor
							</p>
						</div>
						<Switch
							name="snProgramaSocioTorcedor"
							checked={values?.snProgramaSocioTorcedor}
							onCheckedChange={(e) => handleInput('snProgramaSocioTorcedor', e)}
						/>
					</div>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">Clube</div>
							<p className="text-sm text-muted-foreground ">
								Integração com Clube
							</p>
						</div>
						<Switch
							checked={values?.snProgramaSocioClube}
							onCheckedChange={(e) => handleInput('snProgramaSocioClube', e)}
							name="snProgramaSocioClube"
						/>
					</div>
				</div>
			</div>
			<div className="w-full border-t py-4 mt-6 flex justify-end">
				<Button onClick={onSubmit} variant="default">
					Salvar
				</Button>
			</div>
		</div>
	);
}

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//       { params: { id: '2' } }
//     ],
//     fallback: false // ou true ou 'blocking'
//   }
// }

// export async function getStaticProps({ params }) {
//   // Busca dados para o post com id = params.id
//   return {
//     props: { post }, // será passado para o componente da página
//   }
// }

// export default function Post({ post }) {
//   // Renderiza o post...
// }
