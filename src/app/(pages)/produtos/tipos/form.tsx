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
import { DataKindsProducts, ErrorReq } from '../models';
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
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataKindsProducts;
	mutate: KeyedMutator<DataKindsProducts[]>;
}

export function FormData({ open, setOpen, item, mutate }: Props) {
	const { corporation } = useCorporation();
	const { user } = useAuth();
	const formSchema = z.object({
		nome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: item?.nome || '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = item
				? await api.put('/api/TipoProduto', {
						...item,
						...values,
						tipoProdutoID: item.tipoProdutoID.toString(),
						corporacaoID: corporation?.corporacaoID,
						idAlteracao: user?.usuarioID.toString(),
				  })
				: await api.post('/api/TipoProduto', {
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
					<DialogTitle>Tipo de Produto {item?.tipoProdutoID}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="nome"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome </FormLabel>
									<FormControl>
										<Input placeholder="Nome" {...field} />
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
