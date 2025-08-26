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

import { DataCatalog } from './models';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import useApi from '@/hooks/use-api';
import { useCorporation } from '@/providers/useCorporation';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataCatalog;
	mutate: KeyedMutator<DataCatalog[]>;
}

export function FormData({ open, setOpen, item, mutate }: Props) {
	const { corporation } = useCorporation();
	const formSchema = z.object({
		dataInicioVigencia: z.string({
			message: 'Obrigatório',
		}),
		dataFimVigencia: z.string({
			message: 'Obrigatório',
		}),
		nome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		tipoCatalogo: z.string({
			message: 'Obrigatório',
		}),
		prioridade: z.string({
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dataInicioVigencia: item?.dataInicioVigencia || undefined,
			dataFimVigencia: item?.dataFimVigencia || undefined,
			nome: item?.nome || '',
			tipoCatalogo: item?.tipoCatalogo?.toString() || '',
			prioridade: item?.prioridade?.toString() || '',
		},
	});

	const request = useApi<DataCatalog>({
		url: '/api/Catalogo',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			ativo: true,
			corporacaoID: corporation?.corporacaoID,
			...item,
			...values,
		} as unknown as DataCatalog;
		request.sendRequest(method, data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Catalogo {item?.nome}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="nome"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome do produto</FormLabel>
									<FormControl>
										<Input placeholder="Nome do porduto" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="dataInicioVigencia"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Início da vigênccia</FormLabel>

										<DateTimePicker
											value={field.value}
											onChange={field.onChange}
											placeholder="Selecione uma data"
										/>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dataFimVigencia"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fim da vigênccia</FormLabel>

										<DateTimePicker
											value={field.value}
											onChange={field.onChange}
											placeholder="Selecione uma data"
										/>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="tipoCatalogo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de catalogo </FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="0">Eventos</SelectItem>

												<SelectItem value="1">Produtos</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="prioridade"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prioridade </FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value?.toString()}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="0">Normal</SelectItem>

												<SelectItem value="1">Oferta</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
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
