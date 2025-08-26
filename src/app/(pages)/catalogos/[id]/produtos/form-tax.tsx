'use client';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DataTax } from '../../models';
import useApi from '@/hooks/use-api';
import { useCorporation } from '@/providers/useCorporation';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface Props {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item: DataTax;
}

export function FormDataTax({ setOpen, item }: Props) {
	const { corporation } = useCorporation();
	const [valuesform, setValues] = useState<DataTax>(item ?? ({} as DataTax));

	const formSchema = z
		.object({
			nome: z.string().min(2, {
				message: 'Minimo de 2 caracteres',
			}),
			descricao: z.string().min(2, {
				message: 'Minimo de 2 caracteres',
			}),
			tipoTaxa: z.string({
				required_error: 'Obrigatório',
			}),
			taxaPercentual: z.string().optional(),
			taxaFixa: z.string().optional(),
		})
		.refine((data) => data.tipoTaxa !== '1' || data.taxaPercentual, {
			message: 'taxaPercentual é obrigatório',
			path: ['taxaPercentual'],
		})
		.refine((data) => data.tipoTaxa !== '2' || data.taxaFixa, {
			message: 'taxaFixa é obrigatório',
			path: ['taxaFixa'],
		});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: item?.nome || '',
			descricao: item?.descricao || '',
			tipoTaxa: item?.tipoTaxa?.toString() || '',
			taxaPercentual: item?.taxaPercentual?.toString() || '',
			taxaFixa: item?.taxaFixa?.toString() || '',
		},
	});

	function handleChange(name: string, value: string | boolean | number) {
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	}

	const request = useApi<DataTax>({
		url: '/api/CatalogoProdutoTaxa',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item?.nome ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			corporacaoID: corporation?.corporacaoID,
			...item,
			...valuesform,
			...values,
		} as unknown as DataTax;
		request.sendRequest(method, data).then(() => {
			setOpen(false);
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome da taxa</FormLabel>
							<FormControl>
								<Input placeholder="Nome da taxa" {...field} />
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
								<Input placeholder="Descrição" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						control={form.control}
						name="tipoTaxa"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo taxa </FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={
										field.value?.toString() === 'Percentual' ? '1' : '0'
									}
								>
									<FormControl className="w-full">
										<SelectTrigger>
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="1">Pescentual</SelectItem>
										<SelectItem value="0">Fixa</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="taxaPercentual"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Taxa percentual</FormLabel>
								<FormControl>
									<Input placeholder="Taxa percentual" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="taxaFixa"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Taxa fixa</FormLabel>
								<FormControl>
									<Input placeholder="Taxa fixa" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="md:col-span-3 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4">
					<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel className="text-base">Visível</FormLabel>
							<FormDescription>Habilita visibilidade de compra</FormDescription>
						</div>
						<FormControl>
							<Switch
								checked={valuesform?.snVisivelCompra}
								name="snLimitaporCPF"
								onCheckedChange={(e) => handleChange('snLimitaporCPF', e)}
							/>
						</FormControl>
					</FormItem>

					<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel className="text-base">Corporativo</FormLabel>
							<FormDescription>Habilita taxa corporativo</FormDescription>
						</div>
						<FormControl>
							<Switch
								checked={valuesform?.snHabilita_Corporativo}
								name="snHabilita_Corporativo"
								onCheckedChange={(e) =>
									handleChange('snHabilita_Corporativo', e)
								}
							/>
						</FormControl>
					</FormItem>

					<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel className="text-base">Ativo</FormLabel>
							<FormDescription>Habilta taxa ativa</FormDescription>
						</div>
						<FormControl>
							<Switch
								checked={valuesform?.ativo}
								name="snPermiteTaxa"
								onCheckedChange={(e) => handleChange('snPermiteTaxa', e)}
							/>
						</FormControl>
					</FormItem>
				</div>

				<div className="flex justify-between gap-10 mt-6">
					<Button onClick={() => setOpen(false)} variant="secondary">
						Cancelar
					</Button>
					<Button type="submit">Salvar</Button>
				</div>
			</form>
		</Form>
	);
}
