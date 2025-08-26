import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DatKindTicketsEvent } from '../models';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import api from '@/lib/api/axios';
import { useCorporation } from '@/providers/useCorporation';
import { useAuth } from '@/providers/useAuth';

import { KeyedMutator } from 'swr';
import { ErrorReq } from '@/hooks/use-api';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';

import useApiList from '@/hooks/use-api-list';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DatKindTicketsEvent;
	mutate: KeyedMutator<DatKindTicketsEvent[]>;
	eventosID: number;
}

export function FormData({ open, setOpen, item, mutate, eventosID }: Props) {
	const { corporation } = useCorporation();
	const { user } = useAuth();

	const tickets = useApiList<DatKindTicketsEvent[]>({
		url: `api/TipoIngresso/List?CorporacaoGuid=${corporation?.corporacaoGuid}`,
		fetcher: !!corporation,
	});

	const formSchema = z.object({
		tipoIngressoID: z.string({
			message: 'Obrigatório',
		}),
		descricaoIngressoNome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),

		qtdeDisponivel: z.string({
			message: 'Obrigatório',
		}),
		qtdeMaximaDisponivel: z.string({
			message: 'Obrigatório',
		}),
		qtdeLimiteCpf: z.string({
			message: 'Obrigatório',
		}),
		valorFace: z.string({
			message: 'Obrigatório',
		}),
		precoUnitario: z.string({
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),

		defaultValues: {
			tipoIngressoID: item?.tipoIngressoID?.toString() || '',
			descricaoIngressoNome: item?.descricaoIngressoNome || '',
			qtdeDisponivel: item?.qtdeDisponivel?.toString() || '',
			qtdeMaximaDisponivel: item?.qtdeMaximaDisponivel?.toString() || '',
			qtdeLimiteCpf: item?.qtdeLimiteCpf?.toString() || '',
			valorFace: item?.valorFace?.toString() || '',
			precoUnitario: item?.precoUnitario?.toString() || '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = item
				? await api.put('/api/EventosTipoIngresso', {
						...item,
						...values,
						eventosID,
						codigoTipoIngresso: item.codigoTipoIngresso.toString(),
						corporacaoID: corporation?.corporacaoID,
						idAlteracao: user?.usuarioID.toString(),
				  })
				: await api.post('/api/EventosTipoIngresso', {
						...values,
						ativo: true,
						eventosID,
						idInclusao: user?.usuarioID.toString(),
						corporacaoID: corporation?.corporacaoID,
				  });
			if (response) {
				toast.custom((t) => (
					<Toaster t={t} type="success" description={'Alterado com sucesso.'} />
				));
				setOpen(false);
				mutate();
			}
		} catch (error: unknown) {
			const err: ErrorReq = error as ErrorReq;
			toast.custom((t) => (
				<Toaster
					t={t}
					type="error"
					description={err?.response?.data?.message || 'Erro na operação.'}
				/>
			));
		}
	}

	console.log('kkkkk', item);

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Tipo de ingresso {item?.nome}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="tipoIngressoID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de ingresso</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={!!item}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Tipo de produto" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{tickets.response.map((option) => (
													<SelectItem
														key={option.tipoIngressoID}
														value={option.tipoIngressoID.toString()}
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
								name="descricaoIngressoNome"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Descrição no SITE </FormLabel>
										<FormControl>
											<Input placeholder="Descrição" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="col-span-2 grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="qtdeDisponivel"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Qtd. disponivel </FormLabel>
										<FormControl>
											<Input placeholder="Qtd. disponivel" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="qtdeMaximaDisponivel"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Qtd. máxima </FormLabel>
										<FormControl>
											<Input placeholder="Max. disponivel" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="qtdeLimiteCpf"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Limite por CPF</FormLabel>
										<FormControl>
											<Input placeholder="Limite" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="valorFace"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Valor face </FormLabel>
										<FormControl>
											<Input placeholder="valor" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="precoUnitario"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Preço </FormLabel>
										<FormControl>
											<Input placeholder="Preço" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button onClick={() => setOpen(false)} variant="secondary">
								Cancelar
							</Button>
							<Button type="submit">Salvar</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
