import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useApi from '@/hooks/use-api';
import { useAttribute } from '@/hooks/use-attribute';

import { DataCorporation } from '@/providers/useCorporation';
import { useState } from 'react';
import { FiPlus, FiRefreshCcw } from 'react-icons/fi';
interface Data {
	corPrimaria: string;
	corSecundaria: string;
	imagemLogoDois: string;
	imagemLogo: string;
}

interface Props {
	corporation: DataCorporation;
}
export default function LayoutCorporation({ corporation }: Props) {
	const [values, setValues] = useState<Data>(corporation as Data);
	const [enabled, setEnabled] = useState<{
		imagemLogoDois: boolean;
		imagemLogo: boolean;
	}>({
		imagemLogoDois: false,
		imagemLogo: false,
	});

	const { attributeAll, addAttributes } = useAttribute(corporation?.guid);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));

		onSubmit({
			[name]: value,
		});
	};

	const [message, setMessage] = useState('');
	const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		//setFetch(false);

		if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
			return;
		}

		const file: File = e.currentTarget.files[0];
		const fileSize: number = file.size;
		const fileName: string = file.name;
		const fileLimit: number = 350;
		const fileSizeInKB: number = fileSize / 1024;
		const reader: FileReader = new FileReader();
		const img: HTMLImageElement = new Image();

		img.src = window.URL.createObjectURL(file);

		img.onload = () => {
			if (img.width <= 1000) {
				reader.onloadend = function () {
					if (fileSizeInKB < fileLimit) {
						const resultado: string | ArrayBuffer | null = reader.result;
						if (typeof resultado === 'string') {
							setValues((prevValues) => ({
								...prevValues,
								[e.target.name]: resultado,
							}));

							setEnabled({
								...enabled,
								[e.target.name]: true,
							});
							setMessage('');
						}
					} else {
						setValues({
							...values,
							[e.target.name]: null,
						});
						setMessage(
							`A imagem ${fileName} tem (${fileSize} kb) mais de ${fileLimit} kb.`
						);
					}
				};
				reader.readAsDataURL(file);
				return;
			}

			setMessage(`A imagem ${fileName} tem ${img.width} x ${img.height}.`);
			setValues((prevValues) => ({
				...prevValues,
				[e.target.name]: null,
			}));
		};
	};

	const { sendRequest } = useApi<DataCorporation>({
		url: '/api/corporacao',
	});

	const onSubmit = async (obj: { [key: string]: string }) => {
		await sendRequest(
			'put',
			{ ...corporation, ...obj },
			'',
			corporation?.corporacaoID
		);
		setEnabled({
			imagemLogoDois: false,
			imagemLogo: false,
		});
	};

	const handleInputAttrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		onSubmitAttr(value, name, attributeAll?.[name]?.corporacaoAtributoID);
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
		<div className="flex flex-col">
			{message}
			<div className="flex flex-col items-center md:grid md:grid-cols-[400_400] gap-4">
				<div className="space-y-4 border rounded-md p-4 mb-4 w-full flex-1">
					<p>Logo principal</p>
					<div
						className="w-40 h-40 bg-cover bg-center  mx-auto "
						style={{
							backgroundImage: `url(${values?.imagemLogo})`,
						}}
					></div>
					<Input
						accept="image/*"
						id="imagemLogo"
						multiple
						type="file"
						name="imagemLogo"
						style={{ display: 'none' }}
						onChange={upload}
					/>
					<div className="flex justify-center">
						{enabled['imagemLogo'] ? (
							<div className="flex gap-4 pay-2">
								<Button
									variant="secondary"
									onClick={() => setEnabled({ ...enabled, imagemLogo: false })}
								>
									Cancelar
								</Button>
								<Button
									variant="default"
									onClick={() => onSubmit({ imagemLogo: values.imagemLogo })}
								>
									Salvar
								</Button>
							</div>
						) : (
							<label htmlFor="imagemLogo" className="cursor-pointer p-2">
								{values?.imagemLogo ? <FiRefreshCcw /> : <FiPlus />}
							</label>
						)}
					</div>
				</div>

				<div className="space-y-4 border rounded-md p-4 mb-4 w-full flex-1">
					<p>Logo secundario</p>
					<div
						className="w-40 h-40 bg-cover bg-center  mx-auto "
						style={{
							backgroundImage: `url(${values?.imagemLogoDois})`,
						}}
					></div>
					<Input
						accept="image/*"
						id="imagemLogoDois"
						multiple
						type="file"
						name="imagemLogoDois"
						style={{ display: 'none' }}
						onChange={upload}
					/>
					<div className="flex justify-center">
						{enabled['imagemLogoDois'] ? (
							<div className="flex gap-4 pay-2">
								<Button
									variant="secondary"
									onClick={() =>
										setEnabled({ ...enabled, imagemLogoDois: false })
									}
								>
									Cancelar
								</Button>
								<Button
									variant="default"
									onClick={() =>
										onSubmit({ imagemLogoDois: values.imagemLogoDois })
									}
								>
									Salvar
								</Button>
							</div>
						) : (
							<label htmlFor="imagemLogoDois" className="cursor-pointer p-2">
								{values?.imagemLogoDois ? <FiRefreshCcw /> : <FiPlus />}
							</label>
						)}
					</div>
				</div>
			</div>
			<div className="space-y-8">
				<div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
					<div className="grid grid-cols-[90px_1fr] items-center gap-4">
						<Input
							type="color"
							defaultValue={values?.corPrimaria}
							id="corPrimaria"
							name="corPrimaria"
							onBlur={handleInputChange}
						/>

						<label htmlFor="corPrimaria">Cor primária</label>
					</div>

					<div className="grid grid-cols-[90px_1fr] items-center gap-4">
						<Input
							type="color"
							defaultValue={values?.corSecundaria}
							id="corSecundaria"
							name="corSecundaria"
							onBlur={handleInputChange}
						/>
						<label htmlFor="corSecundaria">Cor secundária</label>
					</div>
				</div>
				<div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
					<div className="grid grid-cols-[90px_1fr] items-center gap-4">
						<Input
							type="color"
							defaultValue={attributeAll?.corTextoPrimaria?.valor}
							id="corTextoPrimaria"
							name="corTextoPrimaria"
							onBlur={handleInputAttrChange}
						/>
						<label htmlFor="corTextoPrimaria">Cor texto primária </label>
					</div>

					<div className="grid grid-cols-[90px_1fr] items-center gap-4">
						<Input
							type="color"
							defaultValue={attributeAll?.corTextoSecundaria?.valor}
							id="corTextoSecundaria"
							name="corTextoSecundaria"
							onBlur={handleInputAttrChange}
						/>

						<label htmlFor="corPrimaria">Cor texto secundária</label>
					</div>
				</div>
				<div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
					<div className="grid grid-cols-[90px_1fr] items-center gap-4">
						<Input
							type="color"
							defaultValue={attributeAll?.corBackgroundCard?.valor}
							id="corBackgroundCard"
							name="corBackgroundCard"
							onBlur={handleInputAttrChange}
						/>
						<label htmlFor="corBackgroundCard">Cor fundo card de venda </label>
					</div>

					<div className="grid grid-cols-[90px_1fr] items-center gap-4">
						<Input
							type="color"
							defaultValue={attributeAll?.corTextoCard?.valor}
							id="corTextoCard"
							name="corTextoCard"
							onBlur={handleInputAttrChange}
						/>

						<label htmlFor="corTextoCard">Cor texto card de venda </label>
					</div>
				</div>
			</div>
		</div>
	);
}
