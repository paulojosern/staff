import { DataCorporation } from '@/providers/useCorporation';
import { Data, DataGeneric } from './models';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiChevronLeft } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { GallerySelected } from '@/app/(pages)/galeria/selected';
import { randomUUID } from 'crypto';

type PropsAttributes = {
	generic?: DataGeneric;
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
export function LayoutContentGeneric({
	generic,
	data,
	hidePages,
	addAttributes,
	corporation,
	corporacaoAtributoID,
}: PropsAttributes) {
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<DataGeneric | null>(
		generic as DataGeneric
	);

	const handelChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
		viewer = ''
	) => {
		const { name, value } = e.target;

		const data = {
			...values,
			[viewer || name]: viewer ? { ...values?.[viewer], [name]: value } : value,
		} as DataGeneric;

		setValues(data);
	};

	const handleSwitch = (viewer: string, name: string, value: boolean) => {
		const data = {
			...values,
			[viewer]: { ...values?.[viewer], [name]: value },
		} as DataGeneric;
		setValues(data);
	};

	const [label, setLabel] = useState<string>('');

	const handelOpen = (value: boolean, image: string) => {
		setLabel(image);
		setOpen(value);
	};

	const onSelectImage = (public_id: string) => {
		setOpen(false);
		const data = {
			...values,
			[label]: { ...values?.[label], public_id },
		} as DataGeneric;
		setValues(data);
	};

	const onSave = () => {
		const id = generic?.id || randomUUID();
		const payload = {
			...data,
			[id]: values,
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
			{open && (
				<GallerySelected
					open={open}
					setOpen={setOpen}
					onSelection={onSelectImage}
				/>
			)}

			<Input
				name="nome"
				id="nome"
				placeholder="Nome do Contexto"
				defaultValue={values?.nome}
				onChange={handelChange}
			/>

			{/* <Input
				name="slug"
				id="slug"
				placeholder="Nome do menu"
				defaultValue={values?.slug}
				onChange={handelChange}
			/> */}

			<div className="mt-4">
				<label className="p-2 text-sm font-medium">Desktop</label>
				{values?.desktop?.public_id ? (
					<div className="border rounded-lg p-4 my-4">
						<Image
							loading="lazy"
							src={`https://res.cloudinary.com/ligatechstaff/image/upload/${values?.desktop?.public_id}.jpg`}
							alt="SEO"
							width={900}
							height={900}
						/>

						<Button
							variant="secondary"
							className="mt-4"
							onClick={() => {
								handelOpen(true, 'desktop');
							}}
						>
							Trocar imagem desktop
						</Button>
						<div className="flex flex-col md:flex-row gap-4 mt-4">
							<Input
								name="alt"
								id="alt"
								placeholder="Descrição"
								defaultValue={values?.desktop?.alt}
								onChange={(e) => handelChange(e, 'desktop')}
							/>
							<Input
								name="link"
								id="link"
								placeholder="Link"
								defaultValue={values?.desktop?.link}
								onChange={(e) => handelChange(e, 'desktop')}
							/>
						</div>

						<div className="grid md:grid-cols-[180_180_auto] gap-4 mt-4 items-center">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-sm whitespace-nowrap">
									Espaço superior
								</span>
								<Input
									name="spacetop"
									id="spacetop"
									placeholder="Espaço superior"
									defaultValue={values?.desktop?.spacetop}
									onChange={(e) => handelChange(e, 'desktop')}
									type="number"
								/>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<span className="text-sm whitespace-nowrap">
									Espaço inferior
								</span>
								<Input
									name="spacebottom"
									id="spacetop"
									placeholder="Espaço inferior"
									defaultValue={values?.desktop?.spacebottom}
									onChange={(e) => handelChange(e, 'desktop')}
									type="number"
								/>
							</div>
							<div className="flex flex-row  items-center gap-4 text-sm">
								<div className="flex items-center gap-2 text-sm">
									Largura 100%
									<Switch
										name="fullwidth"
										defaultChecked={values?.desktop?.fullwidth}
										onCheckedChange={(e) =>
											handleSwitch('desktop', 'fullwidth', e)
										}
									/>
								</div>
								<div className="flex items-center gap-2 text-sm">
									Centralizado
									<Switch
										name="center"
										defaultChecked={values?.desktop?.center}
										onCheckedChange={(e) =>
											handleSwitch('desktop', 'center', e)
										}
									/>
								</div>
							</div>
						</div>
					</div>
				) : (
					<Button
						variant="secondary"
						onClick={() => {
							handelOpen(true, 'desktop');
						}}
					>
						Adicionar imagem desktop
					</Button>
				)}
				<label className="p-2 text-sm font-medium">Mobile</label>
				{values?.mobile?.public_id ? (
					<div className="border rounded-lg p-4 my-4">
						<Image
							loading="lazy"
							src={`https://res.cloudinary.com/ligatechstaff/image/upload/${values?.mobile?.public_id}.jpg`}
							alt="SEO"
							width={500}
							height={500}
						/>

						<Button
							variant="secondary"
							className="mt-4"
							onClick={() => {
								handelOpen(true, 'mobile');
							}}
						>
							Trocar imagem Mobile
						</Button>
						<div className="flex flex-col md:flex-row gap-4 mt-4">
							<Input
								name="alt"
								id="alt"
								placeholder="Descrição"
								defaultValue={values?.mobile?.alt}
								onChange={(e) => handelChange(e, 'mobile')}
							/>
							<Input
								name="link"
								id="link"
								placeholder="Link"
								defaultValue={values?.mobile?.link}
								onChange={(e) => handelChange(e, 'mobile')}
							/>
						</div>

						<div className="grid md:grid-cols-[180_180_auto] gap-4 mt-4 items-center">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-sm whitespace-nowrap">
									Espaço superior
								</span>
								<Input
									name="spacetop"
									id="spacetop"
									placeholder="Espaço superior"
									defaultValue={values?.mobile?.spacetop}
									onChange={(e) => handelChange(e, 'mobile')}
									type="number"
								/>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<span className="text-sm whitespace-nowrap">
									Espaço inferior
								</span>
								<Input
									name="spacebottom"
									id="spacetop"
									placeholder="Espaço inferior"
									defaultValue={values?.mobile?.spacebottom}
									onChange={(e) => handelChange(e, 'mobile')}
									type="number"
								/>
							</div>
							<div className="flex flex-row  items-center gap-4 text-sm">
								<div className="flex items-center gap-2 text-sm">
									Largura 100%
									<Switch
										name="fullwidth"
										defaultChecked={values?.mobile?.fullwidth}
										onCheckedChange={(e) =>
											handleSwitch('mobile', 'fullwidth', e)
										}
									/>
								</div>
								<div className="flex items-center gap-2 text-sm">
									Centralizado
									<Switch
										name="center"
										defaultChecked={values?.mobile?.center}
										onCheckedChange={(e) => handleSwitch('mobile', 'center', e)}
									/>
								</div>
							</div>
						</div>
					</div>
				) : (
					<Button
						variant="secondary"
						onClick={() => {
							handelOpen(true, 'mobile');
						}}
					>
						Adicionar imagem Mobile
					</Button>
				)}
			</div>
			<div className="flex items-center justify-between gap-4 mt-6">
				<Button onClick={hidePages} color="primary">
					<FiChevronLeft /> Voltar
				</Button>
				<Button
					color="primary"
					onClick={onSave}
					disabled={
						!values?.desktop?.public_id ||
						!values?.mobile?.public_id ||
						!values?.nome
					}
				>
					Salvar
				</Button>
			</div>
		</div>
	);
}
