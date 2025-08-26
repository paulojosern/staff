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

import { PessoaEnderecoData } from '@/app/(pages)/usuarios/models';
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
	pessoaID: number;
	list: string[];
	item?: PessoaEnderecoData;
	mutate: KeyedMutator<unknown>;
}

export function FormDataAddress({
	open,
	setOpen,
	pessoaID,
	list,
	mutate,
	item = {} as PessoaEnderecoData,
}: Props) {
	const formSchema = z.object({
		nomeEndereco: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		cep: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		logradouro: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		numero: z.string({
			message: 'Obrigatório',
		}),
		bairro: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		cidade: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		uf: z.string().min(2, {
			message: 'Minimo de 2 caracteres',
		}),
		complemento: z.string().optional(),
		tipoEndereco: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),

		defaultValues: {
			nomeEndereco: item?.nomeEndereco || '',
			cep: item?.cep || '',
			logradouro: item?.logradouro || '',
			uf: item?.uf || '',
			bairro: item?.bairro || '',
			cidade: item?.cidade || '',
			numero: item?.numero?.toString() || '',
			tipoEndereco: item?.tipoEndereco || list[0],
			complemento: item?.complemento || '',
		},
	});

	const request = useApi<PessoaEnderecoData>({
		url: '/api/Pessoa/Endereco',
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload = {
			...item,
			...values,
			pessoaID,
		} as unknown as PessoaEnderecoData;
		await request
			.sendRequest(item?.pessoaEnderecoID ? 'put' : 'post', payload)
			.then(() => {
				mutate();
				setOpen(false);
				form.reset();
			});
	}

	const handleCep = (cep: string) => {
		form.setValue('cep', cep);

		if (cep.length > 7) {
			const url = `https://viacep.com.br/ws/${cep}/json/`;

			fetch(url)
				.then((response) => response.json())
				.then((dataCep) => {
					if (dataCep) {
						form.setValue('logradouro', dataCep.logradouro);
						form.setValue('bairro', dataCep.bairro);
						form.setValue('cidade', dataCep.localidade);
						form.setValue('uf', dataCep.uf);
					}
				});
		}
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Endereço {item?.tipoEndereco}</DialogTitle>
					<DialogDescription>
						{item?.pessoaEnderecoID ? 'Editar' : 'Cadastrar'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="tipoEndereco"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de endereço</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || list[0]}
											disabled={!!item?.pessoaEnderecoID}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Tipo de endereço" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{list.map((item) => (
													<SelectItem key={item} value={item}>
														{item}
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
								name="nomeEndereco"
								render={({ field }) => (
									<FormItem className="w-full">
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
								name="cep"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Cep </FormLabel>
										<FormControl>
											<Input
												placeholder="Cep"
												{...field}
												onChange={(e) => handleCep(e.target.value)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
							<FormField
								control={form.control}
								name="logradouro"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rua </FormLabel>
										<FormControl>
											<Input placeholder="Rua" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="numero"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Numero </FormLabel>
										<FormControl>
											<Input placeholder="Numero" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="complemento"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Complemento </FormLabel>
									<FormControl>
										<Input placeholder="Numero" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bairro"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bairro </FormLabel>
									<FormControl>
										<Input placeholder="Bairro" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4">
							<FormField
								control={form.control}
								name="cidade"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cidade </FormLabel>
										<FormControl>
											<Input placeholder="Cidade" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="uf"
								render={({ field }) => (
									<FormItem>
										<FormLabel>UF </FormLabel>
										<FormControl>
											<Input placeholder="UF" {...field} />
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
