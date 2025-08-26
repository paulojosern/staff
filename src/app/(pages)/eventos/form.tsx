import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	DataEvents,
	Datalocation,
	DataSectores,
	tipoControleAcesso,
	tipoLeituraQCode,
} from './models';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useCorporation } from '@/providers/useCorporation';

import useApi from '@/hooks/use-api';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { DateTimePicker } from '@/components/ui/date-time-picker';
import { DataProducts } from '../produtos/models';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

import { Tags } from './tags';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Props {
	item?: DataEvents;
	products: DataProducts[];
	location: Datalocation[];
}

export function FormData({ item, products, location }: Props) {
	const { corporation } = useCorporation();

	const { back, push } = useRouter();
	const [loading, setLoading] = useState(false);

	const formSchema = z.object({
		dataEvento: z.string({
			message: 'Obrigatório',
		}),
		dataInicio: z.string({
			message: 'Obrigatório',
		}),
		dataFim: z.string({
			message: 'Obrigatório',
		}),
		produtoID: z.string({
			message: 'Obrigatório',
		}),
		nome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		descricao: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		qtdeMaximaDisponivel: z.string({
			message: 'Obrigatório',
		}),

		tipoLeituraQrCode: z.string({
			message: 'Obrigatório',
		}),
		tipoControleAcesso: z.string({
			message: 'Obrigatório',
		}),
		tituloPDV: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		subTituloPDV: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		nomeSetor: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		descricaoSetor: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),

		defaultValues: {
			produtoID: item?.produtoID?.toString(),
			nome: item?.nome,
			dataEvento: item?.dataEvento || undefined,
			dataInicio: item?.dataInicio || undefined,
			dataFim: item?.dataFim || undefined,
			descricao: item?.descricao,
			qtdeMaximaDisponivel: item?.qtdeMaximaDisponivel?.toString() || '0',
			tipoLeituraQrCode: item?.tipoLeituraQrCode?.toString(),
			tipoControleAcesso: item?.tipoControleAcesso?.toString(),
			tituloPDV: item?.tituloPDV || '',
			subTituloPDV: item?.subTituloPDV || '',
			nomeSetor: item?.nomeSetor || '',
			descricaoSetor: item?.descricaoSetor || '',
		},
	});

	const [valuesform, setValues] = useState<DataEvents>(
		item ?? ({} as DataEvents)
	);

	const [tagsEvento, setTagsEvento] = useState<string>(item?.tagsEvento || '');
	function handleChange(name: string, value: string | boolean | number) {
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	}

	const requestSectors = useApi<DataSectores>({
		url: '/api/EventosSetores',
	});

	const request = useApi<DataEvents>({
		url: '/api/Eventos',
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		save(item?.eventosID ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			...item,
			...valuesform,
			...values,
			tagsEvento,
			corporacaoID: corporation?.corporacaoID,
		} as unknown as DataEvents;

		request
			.sendRequest(method, data)
			.then((response) => {
				if (response) {
					saveSectors(method, values, item?.eventosID ?? response?.id);
				}
			})
			.catch(() => setLoading(false));
	}

	function saveSectors(
		method: 'post' | 'put',
		values: z.infer<typeof formSchema>,
		eventosID: number
	) {
		const { nomeSetor, descricaoSetor, subTituloPDV, tituloPDV } = values;
		requestSectors
			.sendRequest(method, {
				eventosID,
				nomeSetor,
				descricaoSetor,
				subTituloPDV,
				tituloPDV,
			})
			.then(() => {
				if (method === 'post') {
					push(`/tipos-ingressos/${eventosID}`);
				} else {
					push('/eventos');
				}
			})
			.finally(() => setLoading(false));
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
				<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[40%_1fr_1fr_1fr] gap-4">
					<FormField
						control={form.control}
						name="produtoID"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Produto</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value?.toString()}
								>
									<FormControl className="w-full">
										<SelectTrigger>
											<SelectValue placeholder="Produto" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{products.map((option) => (
											<SelectItem
												key={option.produtoID}
												value={option?.produtoID?.toString() || ''}
											>
												{option.nome}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dataEvento"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Data do evento</FormLabel>

								<DateTimePicker
									value={field.value}
									onChange={field.onChange}
									placeholder="Select start date and time"
									// error={errors.startDate?.message}
								/>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dataInicio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Data inicio</FormLabel>

								<DateTimePicker
									value={field.value}
									onChange={field.onChange}
									placeholder="Select start date and time"
								/>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dataFim"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Data fim</FormLabel>

								<DateTimePicker value={field.value} onChange={field.onChange} />

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Input placeholder="Nome do evento..." {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="descricao"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Textarea placeholder="Descrição do evento..." {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[200px_280px_280px_1fr] gap-4">
					<FormField
						control={form.control}
						name="qtdeMaximaDisponivel"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Máx. disponivel</FormLabel>
								<FormControl>
									<Input placeholder="Máx. disponivel..." {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tipoControleAcesso"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Acesso </FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value?.toString()}
								>
									<FormControl className="w-full">
										<SelectTrigger>
											<SelectValue placeholder="Acesso" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.entries(tipoControleAcesso).map(([key, value]) => (
											<SelectItem key={key} value={key}>
												{value}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tipoLeituraQrCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Leitura </FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value?.toString()}
								>
									<FormControl className="w-full">
										<SelectTrigger>
											<SelectValue placeholder="Leitura" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.entries(tipoLeituraQCode).map(([key, value]) => (
											<SelectItem key={key} value={key}>
												{value}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{location?.length > 0 && (
						<FormItem>
							<FormLabel>Localização </FormLabel>
							<Select
								onValueChange={(e) => handleChange('eventosLocalizacaoID', e)}
								defaultValue={valuesform?.eventosLocalizacaoID?.toString()}
							>
								<FormControl className="w-full">
									<SelectTrigger>
										<SelectValue placeholder="Leitura" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value={'0'}>Nenhum</SelectItem>
									{location.map((option) => (
										<SelectItem
											key={option.eventosLocalizacaoID}
											value={option?.eventosLocalizacaoID?.toString() || ''}
										>
											{option.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				</div>
				<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4">
					<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel className="text-base">STAFF</FormLabel>
							<FormDescription>Habilita STAFF para este evento</FormDescription>
						</div>
						<FormControl>
							<Switch
								checked={valuesform?.snStaff}
								name="snStaff"
								onCheckedChange={(e) => handleChange('snStaff', e)}
							/>
						</FormControl>
					</FormItem>

					<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel className="text-base">
								Informações adicionais
							</FormLabel>
							<FormDescription>Habilita criação de formulários</FormDescription>
						</div>
						<FormControl>
							<Switch
								checked={valuesform?.snInfoAdicionalBeneficiario}
								name="snInfoAdicionalBeneficiario"
								onCheckedChange={(e) => {
									handleChange('snInfoAdicionalBeneficiario', e);
									handleChange('snDemonstraBeneficiario', e);
								}}
							/>
						</FormControl>
					</FormItem>
					{valuesform?.snInfoAdicionalBeneficiario && (
						<>
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">
										Demonstra beneficiario
									</FormLabel>
									<FormDescription>
										Habilita o campo de beneficiario
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snDemonstraBeneficiario}
										name="snDemonstraBeneficiario"
										onCheckedChange={(e) =>
											handleChange('snDemonstraBeneficiario', e)
										}
									/>
								</FormControl>
							</FormItem>
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">
										Benefíciario automático
									</FormLabel>
									<FormDescription>
										Default de beneficiario com o nome do titular
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snBeneficiarioAutomatico}
										name="snBeneficiarioAutomatico"
										onCheckedChange={(e) =>
											handleChange('snBeneficiarioAutomatico', e)
										}
									/>
								</FormControl>
							</FormItem>
						</>
					)}
				</div>
				<Tags tagsEvento={tagsEvento} setTagsEvento={setTagsEvento} />
				<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4">
					<FormField
						control={form.control}
						name="tituloPDV"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Titulo PDV</FormLabel>
								<FormControl>
									<Input placeholder="Titulo PDV" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="subTituloPDV"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subtitulo PDV</FormLabel>
								<FormControl>
									<Input placeholder="Subtitulo PDV" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="nomeSetor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome do setor</FormLabel>
								<FormControl>
									<Input placeholder="Nome do setor" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="descricaoSetor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descrição do setor</FormLabel>
								<FormControl>
									<Input placeholder="Descrição do setor" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-between gap-10 mt-6">
					<Button
						onClick={(e) => {
							e.preventDefault();
							back();
						}}
						variant="secondary"
						disabled={requestSectors.isLoading || loading}
					>
						Voltar
					</Button>
					<Button type="submit">
						{requestSectors.isLoading ||
							(loading && <Loader2 className="animate-spin" size={20} />)}{' '}
						Salvar
					</Button>
				</div>
			</form>
		</Form>
	);
}
