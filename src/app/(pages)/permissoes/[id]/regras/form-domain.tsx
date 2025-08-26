import { Dominio, ProfileDomain } from '../../models';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mutate: KeyedMutator<ProfileDomain[]>;
	permissaoPerfilID: number;
	domains: Dominio[];
	item?: ProfileDomain;
}

export default function FormDomain({
	open,
	setOpen,
	item,
	mutate,
	domains,
	permissaoPerfilID,
}: Props) {
	const formSchema = z.object({
		telaID: z.string({
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			telaID: item?.telaID?.toString() || '',
		},
	});

	const request = useApi<ProfileDomain>({
		url: '/api/PerfilTelas',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item?.perfilTelaID ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			...item,
			...values,
			permissaoPerfilID,
		} as unknown as ProfileDomain;

		request.sendRequest(method, data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Domínios {item?.permissaoPerfilID}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="telaID"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Domínio </FormLabel>
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
											{domains?.map((domain) => (
												<SelectItem
													key={domain.telaID}
													value={domain.telaID.toString()}
												>
													{domain.nomeTela}
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
