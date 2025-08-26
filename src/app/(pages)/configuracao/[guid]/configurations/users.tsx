import { Switch } from '@/components/ui/switch';
import { useAttribute } from '@/hooks/use-attribute';
import { DataCorporation } from '@/providers/useCorporation';
import { useEffect, useState } from 'react';

interface Data {
	events: Events;
}

interface Events {
	btn_evento: boolean;
	btn_obs: boolean;
	cadastro_email: boolean;
	mostrar_datas: boolean;
	mostrar_incrementador: boolean;
	mostrar_qtd_ingressos: boolean;
	mostrar_titulo: boolean;
}
interface Props {
	corporation: DataCorporation;
}
export default function ConfigurationUsers({ corporation }: Props) {
	const { attribute, addAttributes, corporacaoAtributoID } = useAttribute<Data>(
		corporation?.guid,
		'enabledByUser'
	);

	const [values, setValues] = useState<Events>({} as Events);

	useEffect(() => {
		if (attribute) setValues(attribute?.events);
		console.log('kkk');
	}, [attribute]);

	const handleInput = (name: string, value: boolean) => {
		const data = {
			...values,
			[name]: value,
		};
		setValues(data);

		onSubmit(JSON.stringify({ events: data }), 'pages', corporacaoAtributoID);
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

	return (
		<div className="flex flex-col">
			<label className="p-2 text-sm font-medium">Cadastro</label>
			<div className="grid gap-2 grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] mb-4">
				<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
					<div>
						<div className="text-base font-medium pb-1">
							Bloquear visualização de eventos
						</div>
						<p className="text-sm text-muted-foreground  ">
							Desabilita a veda para o publico em geral, exibindo apenas para
							usuarios selecionados.
						</p>
					</div>
					<Switch
						checked={values?.cadastro_email}
						name="cadastro_email"
						onCheckedChange={(e) => handleInput('cadastro_email', e)}
					/>
				</div>
			</div>
		</div>
	);
}
