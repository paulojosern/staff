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
import { DataTypeTicket } from './models';
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

const FormaDesconto = [
	'Inteira',
	'Meia Entrada',
	'Voucher',
	'Gratuidade',
	'Credencial',
	'Troca Voucher',
	'Mifare',
];
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataTypeTicket;
	mutate: KeyedMutator<DataTypeTicket[]>;
}

export function FormData({ open, setOpen, item, mutate }: Props) {
	const { corporation } = useCorporation();
	const { user } = useAuth();

	const formSchema = z.object({
		nome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		descricao: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		formaDesconto: z.string({
			message: 'Obrigatório',
		}),
		valor: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),

		defaultValues: {
			nome: item?.nome || '',
			descricao: item?.descricao || '',
			formaDesconto: item?.formaDesconto?.toString() || '',
			valor: item?.valor?.toString() || '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = item
				? await api.put('/api/tipoIngresso', {
						...item,
						...values,
						codigoTipoIngresso: item.codigoTipoIngresso.toString(),
						corporacaoID: corporation?.corporacaoID,
						idAlteracao: user?.usuarioID.toString(),
				  })
				: await api.post('/api/tipoIngresso', {
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
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Tipo de ingresso {item?.codigoTipoIngresso}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="nome"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de produto</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Tipo de produto" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{FormaDesconto.map((option) => (
													<SelectItem key={option} value={option}>
														{option}
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
								name="formaDesconto"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de produto</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Forma desconto" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="1">Valor</SelectItem>
												<SelectItem value="0">Percentual</SelectItem>
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="valor"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Valor </FormLabel>
										<FormControl>
											<Input placeholder="valor" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="descricao"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição </FormLabel>
									<FormControl>
										<Input placeholder="Descrição" {...field} />
									</FormControl>
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
