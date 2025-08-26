import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DataCorporation } from '@/providers/useCorporation';
import { Data, LayoutHome } from './models';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiChevronLeft } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { GallerySelected } from '@/app/(pages)/galeria/selected';

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
export function LayoutContentHome({
	corporation,
	data,
	hidePages,
	addAttributes,
	corporacaoAtributoID,
}: PropsAttributes) {
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<LayoutHome | null>(data?.home);

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
				} as LayoutHome)
		);
	};

	const [label, setLabel] = useState<string>('');

	const handelOpen = (value: boolean, image: string) => {
		setLabel(image);
		setOpen(value);
	};

	const onSelectImage = (image: string) => {
		setOpen(false);
		setValues(
			(prevValues) =>
				({
					...prevValues,
					[label]: image,
				} as LayoutHome)
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
			<label className="p-2 text-sm font-medium">Home</label>
			{!corporation?.snModuloIngressos && (
				<div className="grid gap-4 grid-cols md:grid-cols-[1fr_1fr_1fr] mb-4">
					<Select
						name="tema"
						onValueChange={(value) =>
							handelChange({
								target: { value, name: 'tema' },
							} as React.ChangeEvent<HTMLSelectElement>)
						}
						defaultValue={values?.tema || ''}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Tema de layout" id="tema" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Tema de layout</SelectLabel>
								<SelectItem value="default">Default</SelectItem>
								<SelectItem value="home">Home c/ calendario</SelectItem>
								<SelectItem value="cards">Home c/ cards</SelectItem>
								<SelectItem value="inicial">Inicial</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					<Select
						name="tipo"
						onValueChange={(value) =>
							handelChange({
								target: { value, name: 'tipo' },
							} as React.ChangeEvent<HTMLSelectElement>)
						}
						defaultValue={values?.tipo || ''}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Visualização de eventos" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel> Visualização de eventos</SelectLabel>

								<SelectItem value="2">Eventos / Calendário</SelectItem>
								<SelectItem value="3">Eventos / Lista</SelectItem>
								<SelectItem value="4">Eventos / Lado a lado (Cards)</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<p className="text-sm text-muted-foreground  ">
								Mostrar todas opções
							</p>
						</div>
						<Switch
							checked={values?.mostrar_opcoes}
							name="mostrar_opcoes"
							// onCheckedChange={(e) => handleInput('cadastro_email', e)}
						/>
					</div>
				</div>
			)}
			<div className="grid gap-4 grid-cols  mb-4">
				<Input
					name="layout_descricao"
					id="layout_descricao"
					placeholder="titulo"
					defaultValue={values?.layout_descricao}
					onChange={handelChange}
				/>
				<Input
					name="layout_subtitulo"
					id="layout_subtitulo"
					placeholder="Subtitulo"
					defaultValue={values?.layout_subtitulo}
					onChange={handelChange}
				/>

				<Input
					name="texto_venda"
					id="texto_venda"
					placeholder="Texto de apoio"
					defaultValue={values?.texto_venda}
					onChange={handelChange}
				/>
			</div>
			{!corporation?.snModuloIngressos && (
				<>
					<label className="p-2 text-sm font-medium">Menu ingressos</label>

					<div className="grid gap-4 grid-cols md:grid-cols-[1fr_1fr_1fr] mb-4">
						<Input
							name="menu_ingressos"
							id="menu_ingressos"
							placeholder="Texto menu ingressos"
							defaultValue={values?.menu_ingressos}
							onChange={handelChange}
						/>

						<Input
							name="en"
							id="en"
							placeholder="Texto menu ingressos inglês"
							defaultValue={values?.en}
							onChange={handelChange}
						/>
					</div>
				</>
			)}

			<label className="p-2 text-sm font-medium">SEO</label>

			<div className="grid gap-4 grid-cols mb-4">
				<Textarea
					name="seo_title"
					id="seo_title"
					placeholder="Title"
					defaultValue={values?.seo_title}
					onChange={handelChange}
				/>
				<Textarea
					name="seo_description"
					id="seo_description"
					placeholder="Description"
					defaultValue={values?.seo_description}
					onChange={handelChange}
				/>
			</div>
			<div className="flex flex-col md:flex-row md:items-start gap-4">
				<div className="border rounded-md p-4 mb-4 text-center gap-4">
					{values?.seo_image ? (
						<div className="flex flex-col gap-4 items-center">
							<Image
								loading="lazy"
								src={`https://res.cloudinary.com/ligatechstaff/image/upload/${values?.seo_image}.jpg`}
								alt="SEO"
								width={200}
								height={200}
							/>
							<Button
								variant="secondary"

								// onClick={() => handelOpen(true, 'seo_image')}
							>
								Trocar imagem SEO
							</Button>
						</div>
					) : (
						<Button
							variant="secondary"

							// onClick={() => handelOpen(true, 'seo_image')}
						>
							Adicionar imagem SEO
						</Button>
					)}
				</div>

				<div className="border rounded-md p-4 mb-4 text-center gap-4">
					{values?.seo_favicon ? (
						<div className="flex flex-col gap-4 items-center">
							<Image
								loading="lazy"
								src={`https://res.cloudinary.com/ligatechstaff/image/upload/${values?.seo_favicon}.jpg`}
								alt="FAVICON"
								width={200}
								height={200}
							/>
							<Button
								variant="secondary"
								onClick={() => handelOpen(true, 'seo_favicon')}
							>
								Trocar FAVICON
							</Button>
						</div>
					) : (
						<Button
							variant="secondary"
							onClick={() => handelOpen(true, 'seo_image')}
						>
							Adicionar imagem FAVICON
						</Button>
					)}
				</div>
			</div>
			{open && (
				<GallerySelected
					open={open}
					setOpen={setOpen}
					onSelection={onSelectImage}
				/>
			)}
			<div className="flex items-center justify-between gap-4">
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
