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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { KeyedMutator } from 'swr';
import { Group } from '../models';
import useApi from '@/hooks/use-api';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mutate: KeyedMutator<Group[]>;
	item?: Group;
}

export function FormData({ open, setOpen, item, mutate }: Props) {
	const formSchema = z.object({
		nomeGrupo: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		descricaoGrupo: z.string().min(2, {
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nomeGrupo: item?.nomeGrupo || '',
			descricaoGrupo: item?.descricaoGrupo || '',
		},
	});

	const request = useApi<Group>({
		url: '/api/PermissaoGrupos',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item?.permissaoGrupoID ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			...item,
			...values,
		} as unknown as Group;

		request.sendRequest(method, data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Grupo {item?.permissaoGrupoID}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="nomeGrupo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Nome do grupo" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="descricaoGrupo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input placeholder="Descricao do grupo" {...field} />
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
