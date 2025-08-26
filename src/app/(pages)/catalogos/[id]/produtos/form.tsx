import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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

import { KeyedMutator } from 'swr';

import { DataCatalog, DataCatalogProduct } from '../../models';
import useApi from '@/hooks/use-api';
import { useCorporation } from '@/providers/useCorporation';
import { DataProducts } from '@/app/(pages)/produtos/models';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataCatalogProduct;
	mutate: KeyedMutator<DataCatalogProduct[]>;
	catalogs: DataCatalog[];
	products: DataProducts[];
}

export function FormData({
	open,
	setOpen,
	item,
	mutate,
	catalogs,
	products,
}: Props) {
	const { corporation } = useCorporation();
	const formSchema = z.object({
		titulo: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		sobre: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		catalogoID: z.string({
			message: 'Obrigatório',
		}),
		produtoID: z.string({
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			titulo: item?.titulo || '',
			sobre: item?.sobre || '',
			catalogoID: item?.catalogoID?.toString() || '',
			produtoID: item?.produtoID?.toString() || '',
		},
	});

	const [valuesform, setValues] = useState<DataCatalogProduct>(
		item ?? ({} as DataCatalogProduct)
	);

	function handleChange(name: string, value: string | boolean | number) {
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	}

	const request = useApi<DataCatalogProduct>({
		url: '/api/CatalogoProduto',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			corporacaoID: corporation?.corporacaoID,
			...item,
			...valuesform,
			...values,
		} as unknown as DataCatalogProduct;
		request.sendRequest(method, data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[1125px] overflow-y-auto max-h-[90dvh]  text-left">
				<DialogHeader className="text-left">
					<DialogTitle>Produto {item?.titulo}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="produtoID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Produto </FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
											disabled={!!item}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{products.map((product) => (
													<SelectItem
														key={product.produtoID}
														value={product?.produtoID?.toString()}
													>
														{product.nome}
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
								name="catalogoID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Catalogo </FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
											disabled={!!item}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{catalogs.map((catalog) => (
													<SelectItem
														key={catalog.catalogoID}
														value={catalog.catalogoID.toString()}
													>
														{catalog.nome}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="titulo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Titulo do produto</FormLabel>
									<FormControl>
										<Input placeholder="Titulo do produto" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sobre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sobre o produto</FormLabel>
									<FormControl>
										<Input placeholder="Sobre produto" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4">
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Taxa</FormLabel>
									<FormDescription>Habilta cobrança de taxa</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snPermiteTaxa}
										name="snPermiteTaxa"
										onCheckedChange={(e) => handleChange('snPermiteTaxa', e)}
									/>
								</FormControl>
							</FormItem>
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">CPF</FormLabel>
									<FormDescription>Limite por CPF</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snLimitaporCPF}
										name="snLimitaporCPF"
										onCheckedChange={(e) => handleChange('snLimitaporCPF', e)}
									/>
								</FormControl>
							</FormItem>

							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Meia entrada</FormLabel>
									<FormDescription>Permite meia entrada</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.permiteMeiaEntrada}
										name="permiteMeiaEntrada"
										onCheckedChange={(e) =>
											handleChange('permiteMeiaEntrada', e)
										}
									/>
								</FormControl>
							</FormItem>
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Cupom</FormLabel>
									<FormDescription>Permite adicionar cupom</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snPermiteCupom}
										name="snPermiteCupom"
										onCheckedChange={(e) => handleChange('snPermiteCupom', e)}
									/>
								</FormControl>
							</FormItem>
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Externo</FormLabel>
									<FormDescription>PCatalogo externo</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snCatalogoExterno}
										name="snCatalogoExterno"
										onCheckedChange={(e) =>
											handleChange('snCatalogoExterno', e)
										}
									/>
								</FormControl>
							</FormItem>

							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Condição</FormLabel>
									<FormDescription>Venda condicionada</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.snVendaCondicionada}
										name="snVendaCondicionada"
										onCheckedChange={(e) =>
											handleChange('snVendaCondicionada', e)
										}
									/>
								</FormControl>
							</FormItem>
							<div className="flex flex-col gap-2 pt-5">
								<FormLabel>Quantiddade máxima</FormLabel>

								<Input
									placeholder="Quantiddade máxima"
									value={valuesform?.qtdeMaximaDisponivel}
									onChange={(e) =>
										handleChange('qtdeMaximaDisponivel', e.target.value)
									}
								/>
							</div>
						</div>

						<div className="flex justify-between gap-10 mt-6">
							<Button onClick={() => setOpen(false)} variant="secondary">
								Cancelar
							</Button>
							<Button type="submit">Salvar</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
