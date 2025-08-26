import { Switch } from '@/components/ui/switch';
import { useAttribute } from '@/hooks/use-attribute';
import { DataCorporation } from '@/providers/useCorporation';
import { useEffect, useState } from 'react';

interface Data {
	events: Events;
}

interface Events {
	pagseguro_orders: boolean;
}
interface Props {
	corporation: DataCorporation;
}
export default function ConfigurationPayment({ corporation }: Props) {
	const { attribute, addAttributes, corporacaoAtributoID } = useAttribute<Data>(
		corporation?.guid,
		'pages'
	);

	const [values, setValues] = useState<Events>({} as Events);

	useEffect(() => {
		if (attribute) setValues(attribute?.events);
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
			<label className="p-2 text-sm font-medium">Pagamento</label>
			<div className="grid gap-2 grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr] mb-4">
				<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
					<div>
						<div className="text-base font-medium pb-1">
							API PageSeguro Orders
						</div>
						<p className="text-sm text-muted-foreground ">
							Habilita a venda pela API PageSeguro Orders
						</p>
					</div>
					<Switch
						checked={values?.pagseguro_orders}
						name="pagseguro_orders"
						onCheckedChange={(e) => handleInput('pagseguro_orders', e)}
					/>
				</div>
			</div>
		</div>
	);
}
