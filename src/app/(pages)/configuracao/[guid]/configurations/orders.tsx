import { Switch } from '@/components/ui/switch';
import { useAttribute } from '@/hooks/use-attribute';
import { DataCorporation } from '@/providers/useCorporation';
import { useEffect, useState } from 'react';

interface Props {
	corporation: DataCorporation;
}
export default function ConfigurationOrders({ corporation }: Props) {
	const { attributeAll, addAttributes } = useAttribute(corporation?.guid);
	const [mostrar_troca_eventos, setMostrar_troca_eventos] = useState(false);

	useEffect(() => {
		if (attributeAll?.['mostrar_troca_eventos'])
			setMostrar_troca_eventos(
				attributeAll?.['mostrar_troca_eventos']?.valor === 'show'
			);
	}, [attributeAll]);

	const handleInput = (name: string, value: boolean) => {
		const ckecked = value ? 'show' : 'hide';
		setMostrar_troca_eventos(value);
		onSubmitAttr(ckecked, name, attributeAll?.[name]?.corporacaoAtributoID);
	};

	const onSubmitAttr = async (
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
		<div className="flex flex-col mb-4">
			<label className="p-2 text-sm font-medium">Pedidos</label>
			<div className="grid gap-2 grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] mb-4">
				<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
					<div>
						<div className="text-base font-medium pb-1">
							Mostrar troca de eventos
						</div>
						<p className="text-sm text-muted-foreground  ">
							Habilta troca de eventos dentro da pagina de pedidos do cliente.
						</p>
					</div>
					<Switch
						checked={mostrar_troca_eventos}
						name="mostrar_troca_eventos"
						onCheckedChange={(e) => handleInput('mostrar_troca_eventos', e)}
					/>
				</div>
			</div>
		</div>
	);
}
