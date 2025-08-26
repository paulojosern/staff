import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { DataCorporation } from '@/providers/useCorporation';
import { KeyedMutator } from 'swr';
import useApi from '@/hooks/use-api';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mutate: KeyedMutator<DataCorporation[]>;
}

export function FormData({ open, setOpen, mutate }: Props) {
	const formSchema = z.object({
		nome: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		subDominio: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: '',
			subDominio: '',
		},
	});

	const request = useApi<DataCorporation>({
		url: '/api/Corporacao',
	});

	const requestRegister = useApi({
		url: '/api/Pessoa',
	});

	const requestUser = useApi({
		url: '/api/Usuario',
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const guid = uuidv4();
		const data = {
			...values,
			guid,
			ativo: true,
		} as unknown as DataCorporation;

		await request.sendRequest('post', data).then(() => {
			register(data);
		});
	}

	async function register(values: DataCorporation) {
		const data = {
			TipoPessoa: 'Juridica',
			pessoaJuridica: {
				fantasia: values?.nome,
				razaoSocial: values?.subDominio,
				contato: values?.subDominio + '@ligatech.com.br',
			},
			pessoaDocumento: [
				{
					tipoDocumento: 'CNPJ',
					numero: values.guid.replace(/[^\d]+/g, ''),
				},
			],
		} as unknown;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await requestRegister.sendRequest('post', data).then((response: any) => {
			registeUser(response.id, values.guid, values?.subDominio);
		});
	}

	async function registeUser(
		pessoaID: number,
		corporacaoGuid: string,
		subDominio?: string
	) {
		const data = {
			pessoaID,
			corporacaoGuid,
			tipoUsuario: 'Parceiro',
			login: subDominio + '@ligatech.com.br',
			senha: subDominio + '@123',
		} as unknown;

		await requestUser.sendRequest('post', data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>Nova corporação</DialogTitle>
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

						<FormField
							control={form.control}
							name="subDominio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sub Domínio </FormLabel>
									<FormControl>
										<Input placeholder="Sub Domínio " {...field} />
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
