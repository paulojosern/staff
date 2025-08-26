import { Profile } from '../../models';
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

import useApi from '@/hooks/use-api';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mutate: KeyedMutator<Profile[]>;
	item?: Profile;
}

export default function FormProfile({ open, setOpen, item, mutate }: Props) {
	const formSchema = z.object({
		nomePerfil: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		descricaoPerfil: z.string().min(2, {
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nomePerfil: item?.nomePerfil || '',
			descricaoPerfil: item?.descricaoPerfil || '',
		},
	});

	const request = useApi<Profile>({
		url: '/api/PermissaoPerfil',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item?.permissaoGrupoID ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			...item,
			...values,
		} as unknown as Profile;

		request.sendRequest(method, data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Perfil {item?.permissaoPerfilID}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="nomePerfil"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Nome do perfil" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="descricaoPerfil"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input placeholder="Descricao do perfil" {...field} />
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
