'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAttribute } from '@/hooks/use-attribute';
import { DataList, DataListItems } from '../page';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const FormList = dynamic(() => import('./form-list'), {
	ssr: false,
});

type PropsForm = {
	guid: string;
	revalidate: () => void;
};

const ComponentList = ({ guid, revalidate }: PropsForm) => {
	const [open, setOpen] = useState(false);
	const { attribute, addAttributes, corporacaoAtributoID } =
		useAttribute<DataList>(guid, 'formulario_lista');

	async function save(data: DataListItems[], check = true) {
		await addAttributes(
			JSON.stringify({ items: data, ativo: check }),
			'formulario_lista',
			corporacaoAtributoID
		);
		revalidate();
		setOpen(false);
	}

	return (
		<div className="flex items-end sm:items-center  sm:flex-row flex-col justify-between rounded-lg border p-4 mt-2 gap-6">
			{open && (
				<FormList
					setOpen={setOpen}
					open={open}
					data={attribute?.items}
					save={save}
				/>
			)}
			<div>
				<div className="space-y-0.5 font-semibold">Lista</div>
				<p className="text-sm">
					Lista personalizada para ser preenchida no checkout do pedido com o
					evento.
				</p>
			</div>
			<div className="flex items-center justify-between  gap-4 w-full sm:w-auto">
				<Button
					// onClick={() => setInformation('formulario')}
					variant="outline"
				>
					Exportar
				</Button>
				<Button onClick={() => setOpen(true)} variant="outline">
					{attribute ? 'Editar' : 'Adicionar'}
				</Button>
				<Switch
					checked={attribute?.ativo}
					disabled={!attribute}
					onCheckedChange={(active) => {
						console.log(active);
						save(attribute?.items as DataListItems[], active);
					}}
				/>
			</div>
		</div>
	);
};

export default ComponentList;
