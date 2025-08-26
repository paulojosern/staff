import { DataCorporation } from '@/providers/useCorporation';
import { Data, LayoutRodape } from './models';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiChevronLeft } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { maskPhoneDDD } from '@/utils/formats';
import { Label } from '@/components/ui/label';

type PropsAttributes = {
	corporation: DataCorporation;
	data: Data;
	hidePages: () => void;

	addAttributes: (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number,
		corporacaoID?: number
	) => Promise<void>;
	corporacaoAtributoID: number;
};

// Formulario alteração e criação
export function LayoutContentFooter({
	corporation,
	data,
	hidePages,
	addAttributes,
	corporacaoAtributoID,
}: PropsAttributes) {
	const [values, setValues] = useState<LayoutRodape | null>(data?.rodape);

	const handelChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		setValues(
			(prevValues) =>
				({
					...prevValues,
					[name]: value,
				} as LayoutRodape)
		);
	};

	const onSave = () => {
		const payload = {
			...data,
			home: values,
		};

		addAttributes(
			JSON.stringify(payload),
			'layout_dinamic',
			corporacaoAtributoID,
			corporation?.corporacaoID
		);
	};

	return (
		<div className="flex flex-col mb-4">
			<label className="p-2 text-sm font-medium">Rodapé</label>

			<Input
				name="endereco"
				id="endereco"
				placeholder={`Endereço - ` + corporation?.nome}
				defaultValue={values?.endereco}
				onChange={handelChange}
			/>
			<div className="grid gap-4 grid-cols md:grid-cols-4 my-4">
				<Input
					name="atendimento"
					id="atendimento"
					placeholder={`Telefone - ` + corporation?.nome}
					defaultValue={maskPhoneDDD(values?.atendimento)}
					value={maskPhoneDDD(values?.atendimento)}
					onChange={handelChange}
				/>

				<Input
					name="contato"
					id="contato"
					placeholder={`E-mail - ` + corporation?.nome}
					defaultValue={values?.contato}
					onChange={handelChange}
				/>

				<Input
					name="facebook"
					id="facebook"
					placeholder={`facebook - ` + corporation?.nome}
					defaultValue={values?.facebook}
					onChange={handelChange}
				/>

				<Input
					name="instagram"
					id="instagram"
					placeholder={`instagram - ` + corporation?.nome}
					defaultValue={values?.instagram}
					onChange={handelChange}
				/>

				<Input
					name="twitter"
					id="twitter"
					placeholder={`twitter / X - ` + corporation?.nome}
					defaultValue={values?.twitter}
					onChange={handelChange}
				/>
			</div>
			<Label className="p-2 text-sm font-medium">Whatsapp</Label>
			<div className="md:w-[200px] mb-2">
				<Input
					name="whatsapp"
					id="whatsapp"
					placeholder={`whatsapp - ` + corporation?.nome}
					defaultValue={values?.whatsapp}
					onChange={handelChange}
				/>
			</div>
			<Label className="p-2 text-sm font-medium">Copyright</Label>
			<Input
				name="copyright"
				id="copyright"
				placeholder={`copyright - ` + corporation?.nome}
				defaultValue={values?.copyright}
				onChange={handelChange}
			/>
			<div className="flex items-center justify-between gap-4 mt-6">
				<Button onClick={hidePages} color="primary">
					<FiChevronLeft /> Voltar
				</Button>
				<Button color="primary" onClick={onSave}>
					Salvar
				</Button>
			</div>
		</div>
	);
}
