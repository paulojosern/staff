'use client';

import { useCorporation } from '@/providers/useCorporation';
import { use } from 'react';
import Pages from '@/theme/pages';
import { Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	DataInformation,
	DataInformationForm,
	DataInformationItem,
	DataInformationList,
} from '../../models';
import api from '@/lib/api/axios';
import AuthGuard from '@/services/guard/authGuard';
import { DndProvider } from 'react-dnd';
import useApiList from '@/hooks/use-api-list';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from './item';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import FormItem from './form';
import useApi from '@/hooks/use-api';
import { useAttribute } from '@/hooks/use-attribute';
import ComponentList from './list';

export interface DataList {
	items: DataListItems[];
	ativo: boolean;
}

export interface DataListItems {
	id: string;
	label: string;
	nome: string | null;
	documento: string | null;
	pedidoId: number | null;
}

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
	{
		title: 'Eventos',
		url: '/eventos',
	},
];

interface Props {
	params: Promise<{ id: string }>;
}

function EventInformationPage({ params }: Props) {
	const { id } = use(params);
	const { corporation } = useCorporation();
	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState<string>('');

	const { attribute, revalidate } = useAttribute<DataList>(
		corporation?.guid as string,
		'formulario_lista'
	);

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getData = async () => {
		const url = `/api/Eventos?EventosID=${id}`;
		await api
			.get(url)
			.then((response) => {
				setTitle(response.data.nome);
			})
			.catch(() => {
				setTitle('');
			})
			.finally(() => setLoading(false));
	};

	const data = useApiList<DataInformationList[]>({
		url: `/api/EventosTipoInfoBeneficiario/List?eventosID=${id}`,
		fetcher: !!corporation,
	});

	useEffect(() => {
		if (data?.response) {
			data?.response.forEach((item) =>
				addValues(item, item.tipoInformacaoBeneficiarioID)
			);
		}
	}, [data?.response]);

	const [information, setInformation] = useState<
		null | 'formulario' | 'observacao'
	>(null);

	const [open, setOpen] = useState(false);
	const [formulario, setFormulario] = useState<DataInformation>();
	const [form, setForm] = useState<DataInformationItem[]>([]);
	const [formItem, setFormItem] = useState<DataInformationItem | null>(null);
	const [formEdit, setFormEdit] = useState<DataInformationItem | null>(null);
	const [formTitle, setFormTitle] = useState<string>('');

	const addValues = (item: DataInformationList, information: string) => {
		const data = JSON.parse(item.valorInfoAdicional) as DataInformationForm;
		setFormTitle(data.title);
		setForm(data.form);
		setFormulario({
			data,
			eventosTipoInfoBeneficiarioID: item.eventosTipoInfoBeneficiarioID,
			information,
			active: item.ativo,
		});
	};

	useEffect(() => {
		if (formItem) {
			const exist = form.find((i) => i.id === formItem.id);

			if (exist) {
				const index = form.findIndex((i) => i.id === formItem.id);
				const values = [
					...form?.slice(0, index),
					formItem,
					...form?.slice(index + 1),
				];

				setForm(values);
				const value = {
					...formulario,
					information,
					data: {
						title: formTitle,
						form: values,
					},
				} as DataInformation;
				setFormulario(value);
			} else {
				setForm([...form, formItem]);

				const value = {
					...formulario,
					information,
					data: {
						title: formTitle,
						form: [...form, formItem],
					},
				} as DataInformation;

				setFormulario(value);
			}
		}
		setFormItem(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formItem]);

	const handleTitle = (title: string) => {
		setFormTitle(title);
		const value = {
			...formulario,
			information,
			data: {
				title,
				form,
			},
		} as DataInformation;
		setFormulario(value);
	};

	const handleRequired = (required: boolean) => {
		const data = formulario?.data as DataInformationForm;
		const value = {
			...formulario,
			data: {
				...data,
				required,
			},
		} as DataInformation;

		setFormulario(value);
	};

	const onSave = (item: DataInformation | undefined, ativo?: boolean) => {
		if (item)
			save(
				+id,

				item.information,
				JSON.stringify(item.data),
				item.eventosTipoInfoBeneficiarioID,
				ativo ?? item?.active
			);
	};

	const request = useApi<DataInformationList>({
		url: `/api/EventosTipoInfoBeneficiario`,
	});

	const save = async (
		eventosID: number,
		tipoInformacaoBeneficiarioID: string,
		valorInfoAdicional: string,
		eventosTipoInfoBeneficiarioID?: number,
		ativo?: boolean
	) => {
		if (eventosTipoInfoBeneficiarioID) {
			request
				.sendRequest('put', {
					eventosID,
					ativo,
					eventosTipoInfoBeneficiarioID,
					tipoInformacaoBeneficiarioID,
					valorInfoAdicional,
				} as DataInformationList)
				.then(() => {
					data.revalidate();
				});
		} else {
			request
				.sendRequest('post', {
					tipoInformacaoBeneficiarioID,
					valorInfoAdicional,
					eventosID,
					ativo: true,
				} as DataInformationList)
				.then(() => {
					data.revalidate();
				});
		}
	};

	const removeForm = (id: number) => {
		const forms = form.filter((i) => i.id !== id);
		setForm(forms);
		const value = {
			...formulario,
			information,
			data: {
				title: formTitle,
				form: forms,
			},
		} as DataInformation;
		setFormulario(value);
	};

	const moveItem = (fromIndex: number, toIndex: number) => {
		setForm((prevItems) => {
			const newItems = [...prevItems];
			const [movedItem] = newItems.splice(fromIndex, 1);
			newItems.splice(toIndex, 0, movedItem);
			return newItems;
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin" size={40} />
			</div>
		);
	}

	return (
		<Pages title={title} breadcrumb={dataBreadcrumb} icon={<Calendar />}>
			{open && (
				<FormItem
					open={open}
					setOpen={setOpen}
					setFormItem={setFormItem}
					item={formEdit}
				/>
			)}
			<div className="flex flex-col md:grid md:grid-cols-2 gap-4">
				<div className="flex items-end sm:items-center  sm:flex-row flex-col justify-between rounded-lg border p-4 mt-2 gap-6">
					<div>
						<div className="space-y-0.5 font-semibold">Formulário</div>
						<p className="text-sm">
							Criação de formulário apresentado no checkout do pedido com o
							evento.
						</p>
					</div>
					<div className="flex items-center justify-between  gap-4 w-full sm:w-auto">
						<Button
							onClick={() => setInformation('formulario')}
							variant="outline"
						>
							{formulario?.eventosTipoInfoBeneficiarioID
								? 'Editar'
								: 'Adicionar'}
						</Button>
						<Switch
							checked={formulario?.active}
							onCheckedChange={(active) => {
								onSave(formulario, active);
								const value = {
									...formulario,
									active,
								} as DataInformation;
								setFormulario(value);
							}}
						/>
					</div>
				</div>
				<ComponentList
					guid={corporation?.guid as string}
					revalidate={revalidate}
				/>
			</div>

			{information === 'formulario' && (
				<div className="rounded-lg border p-6 mt-4 gap-6">
					<header>
						<div className="mb-4 flex items-center gap-2">
							<Switch
								checked={(formulario?.data as DataInformationForm)?.required}
								onCheckedChange={(active) => {
									handleRequired(active);
								}}
							/>
							<span className="text-sm">Preenchimento obrigatório</span>
						</div>
						{/* <Button
              onClick={() => {
                setFormTitle(informationModel.formTitle)
                setForm(informationModel.form)

                const value = {
                  ...formulario,
                  information,
                  data: {
                    title: informationModel.formTitle,
                    form: informationModel.form
                  }
                }

                setFormulario(value)
              }}
              variant="outlined"
              color="primary"
              endIcon={<FiArrowDown />}
              disabled={!informationModel}
            >
              Adicionar modelo copiado
            </Button> */}
					</header>
					<Textarea
						name="title"
						value={formTitle}
						onChange={(e) => handleTitle(e.target.value)}
					/>

					<div className="grid sm:grid-cols-2 gap-14 items-start mt-4">
						<div>
							<Button
								onClick={() => {
									setFormEdit(null);
									setOpen(true);
								}}
								variant="outline"
							>
								Adicionar um item
							</Button>
							<div className="pt-3">
								<DndProvider backend={HTML5Backend}>
									{form.map((item, index) => (
										<DraggableItem
											key={`${item.id}-${index}`}
											item={item}
											index={index}
											moveItem={moveItem}
											removeForm={removeForm}
											setFormEdit={setFormEdit}
											setOpen={setOpen}
										/>
									))}
								</DndProvider>
							</div>
						</div>
						<div>
							<p className="text-sm italic">Preview:</p>
							<div className="rounded-lg border p-6 mt-4 gap-6">
								<div className="mb-4">{formTitle}</div>
								<div className="flex flex-col gap-2">
									{form?.length > 0 &&
										form?.map((item) => {
											if (item.type === 'select') {
												return (
													<article key={item.id}>
														<Select>
															<SelectTrigger>
																<SelectValue
																	placeholder={item.name || 'Selecione'}
																/>
															</SelectTrigger>

															<SelectContent>
																{(item.externalList
																	? attribute?.items
																	: item?.option
																)?.map((o) => (
																	<SelectItem
																		key={o.id}
																		value={o.label}
																		disabled={item.externalList && !!o?.nome}
																	>
																		{o.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</article>
												);
											}

											if (item.type === 'date') {
												return (
													<article key={item.id}>
														<Input
															name={item.name}
															placeholder={item.name}
															type={item.type}
															defaultValue={item.value}
														/>
													</article>
												);
											}

											if (item.type === 'upload') {
												return (
													<article className="upload" key={item.id}>
														<div className="label">{item.name}</div>
														<div className="box">Copie ou cole aqui</div>
													</article>
												);
											}
											return (
												<article key={item.id}>
													<Input
														name={item.name}
														placeholder={item.name}
														type={item.type}
														defaultValue={item.value}
													/>
												</article>
											);
										})}
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end mt-6">
						{/* <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => {
                addModel(form, formTitle)
                addToast({
                  type: 'success',
                  title: 'Sucesso',
                  description: 'Copiado com sucesso.'
                })
              }}
              endIcon={<FiCopy />}
            >
              Copiar modelo
            </Button> */}
						<Button variant="default" onClick={() => onSave(formulario)}>
							Salvar
						</Button>
					</div>
				</div>
			)}
		</Pages>
	);
}

export default AuthGuard(EventInformationPage);
