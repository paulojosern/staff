'use client';
import { RichTextEditor } from '@/components/elements/RichTextEditor';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { Switch } from '@/components/ui/switch';
import { useAttribute } from '@/hooks/use-attribute';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { DataCorporation } from '@/providers/useCorporation';
import { useEffect, useState } from 'react';

interface Data {
	value: string;
	autenticado: boolean;
	link_interno: boolean;
}

interface Props {
	corporation: DataCorporation;
}
export default function ConfigurationPopUp({ corporation }: Props) {
	const chave = corporation?.snModuloIngressos ? 'popup' : 'popup_home';
	const {
		attribute,
		addAttributes,
		corporacaoAtributoID,
		remove,
		loadingAttributes,
	} = useAttribute<Data>(corporation?.guid, chave);

	const [values, setValues] = useState<Data | null>({
		value: '<p>Digite aqui</p>',
		autenticado: false,
		link_interno: false,
	});

	useEffect(() => {
		const data = {
			value: '<p>Digite aqui</p>',
			autenticado: false,
			link_interno: false,
			...attribute,
		} as Data;
		setValues(data);
	}, [attribute, loadingAttributes]);

	function onChange(value: string) {
		const data = {
			...values,
			value,
		} as Data;
		setValues(data);
	}

	const handleInput = (name: string, value: boolean) => {
		const data = {
			...values,
			[name]: value,
		} as Data;
		setValues(data);
	};

	const onSubmit = async (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number
	) => {
		await addAttributes(
			valor,
			chave,
			corporacaoAtributoID,
			corporation?.corporacaoID
		);
	};

	const confirmationDialog = useConfirmationDialog();

	const handleDeleteClick = async (corporacaoAtributoID: number) => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja excluir?`,
				confirmText: `Sim, excluir`,
				cancelText: 'Não, cancelar',
			});
			onRemove(corporacaoAtributoID);
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};
	const onRemove = async (corporacaoAtributoID: number) => {
		await remove(corporacaoAtributoID).then(() => {
			setValues({
				value: '<p>Digite aqui</p>',
				autenticado: false,
				link_interno: false,
			} as Data);
		});
	};

	return (
		<div className="flex flex-col">
			<ConfirmationDialog hook={confirmationDialog} />
			<label className="p-2  text-sm font-medium">Pop-Up</label>

			<div className="  p-4  border rounded-md space-y-0.5">
				{values?.value && (
					<RichTextEditor
						content={values?.value || ''}
						onChange={onChange}
						placeholder="Digite seu texto aqui..."
						primary={corporation?.corPrimaria || ''}
						secondary={corporation?.corSecundaria || ''}
					/>
				)}
				<div className="grid md:grid-cols-[1fr_1fr_1fr] mb-4 gap-4">
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium pb-1">Autenticado</div>
							<p className="text-sm text-muted-foreground  ">
								Mostrar depois de autenticado
							</p>
						</div>
						<Switch
							checked={values?.autenticado}
							name="autenticado"
							onCheckedChange={(e) => handleInput('mostrar_troca_eventos', e)}
						/>
					</div>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium pb-1">Interno</div>
							<p className="text-sm text-muted-foreground  ">
								Transforma link internos
							</p>
						</div>
						<Switch
							checked={values?.autenticado}
							name="autenticado"
							onCheckedChange={(e) => handleInput('mostrar_troca_eventos', e)}
						/>
					</div>
				</div>
				<div className="flex justify-between items-center mt-2">
					<Button
						variant="secondary"
						onClick={() => handleDeleteClick(corporacaoAtributoID)}
						disabled={!values?.value}
					>
						Excluir
					</Button>
					<Button
						variant="default"
						onClick={() =>
							onSubmit(JSON.stringify(values), chave, corporacaoAtributoID)
						}
					>
						Salvar
					</Button>
				</div>
			</div>
		</div>
	);
}
