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
import { DataKindsProducts, DataProducts, ErrorReq } from './models';
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
import { useEffect, useState } from 'react';
import api from '@/lib/api/axios';
import { useCorporation } from '@/providers/useCorporation';
import { useAuth } from '@/providers/useAuth';
import { KeyedMutator } from 'swr';
import { Toaster } from '@/components/ui/toaster';
import { toast } from 'sonner';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataProducts;
	mutate: KeyedMutator<DataProducts[]>;
}

export function FormData({ open, setOpen, item, mutate }: Props) {
	const { corporation } = useCorporation();
	const { user } = useAuth();
	const [kindProducts, setKindProducts] = useState<DataKindsProducts[]>([]);

	useEffect(() => {
		getKindProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getKindProducts = async () => {
		const url = `/api/TipoProduto/List?CorporacaoGuid=${corporation?.corporacaoGuid}&CorporacaoId=&${corporation?.corporacaoID}`;
		await api
			.get(url)
			.then((response) => {
				setKindProducts(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const formSchema = z.object({
		nome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		tipoProdutoID: z.string().min(2, {
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: item?.nome || '',
			tipoProdutoID: item?.tipoProdutoID?.toString() || '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = item
				? await api.put('/api/Produto', {
						...item,
						...values,
						produtoID: item.produtoID?.toString(),
						corporacaoID: corporation?.corporacaoID,
						idAlteracao: user?.usuarioID.toString(),
				  })
				: await api.post('/api/Produto', {
						...values,
						ativo: true,
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

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Produto {item?.produtoID}</DialogTitle>
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

						<FormField
							control={form.control}
							name="tipoProdutoID"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de produto</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Tipo de produto" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{kindProducts.map((kindProduct) => (
												<SelectItem
													key={kindProduct.tipoProdutoID}
													value={kindProduct.tipoProdutoID.toString()}
												>
													{kindProduct.nome}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

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
