import { Button } from '@/components/ui/button';

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

import { cpfCnpj } from '@/utils/formats';

import { DatePicker } from '@/components/ui/date-picker';
import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { useCorporation } from '@/providers/useCorporation';
import useApi from '@/hooks/use-api';
import { PessoaDataCurrent } from '@/app/(pages)/prestadores/models';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DataUserCreate } from '../../models';

interface Props {
	documentOfParam: string;
	setLoadingPage: Dispatch<SetStateAction<boolean>>;
}

export function FormData({ documentOfParam, setLoadingPage }: Props) {
	const { corporation } = useCorporation();
	const { push } = useRouter();
	const [loading, setLoading] = useState(false);
	const [document, setDocument] = useState(documentOfParam);
	const [pessoaID, setPessoaID] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (corporation) {
			validateUser(documentOfParam, corporation?.corporacaoGuid);
		}
	}, [documentOfParam, corporation]);

	const validateUser = async (documento: string, corporacaoGuid?: string) => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/validate-user?documento=${documento}&corporacaoGuid=${corporacaoGuid}`
			);

			const result = await response.json();
			if (result.usuarioExiste) {
				setError('Usuário ja cadastrado');
			} else {
				setError('');
				setPessoaID(result.pessoaID);
			}
		} catch {
			setError('');
		} finally {
			setLoading(false);
		}
	};

	const formSchema = z
		.object({
			documento: z.string().min(2, {
				message: 'Minimo de 11 caracteres',
			}),
			fantasia: z.string(),
			razaoSocial: z.string(),
			contato: z.string(),
			nome: z.string(),
			sobrenome: z.string(),
			dtNascimento: z.string(),
			sexo: z.string(),
			estadoCivil: z.string(),
			email: z.string().email().min(2, {
				message: 'Minimo de 2 caracteres',
			}),
			tipoTelefone: z.string({
				message: 'Obrigatório',
			}),
			tipoUsuario: z.string(),
			ddi: z.string().min(2, {
				message: 'Minimo de 2 caracteres',
			}),
			ddd: z.string().min(2, {
				message: 'Minimo de 2 caracteres',
			}),
			numero: z.string().min(2, {
				message: 'Minimo de 2 caracteres',
			}),
		})
		.superRefine((data, ctx) => {
			// Validação para CPF (11 caracteres)
			if (data.documento.length === 11) {
				if (!data.nome || data.nome.length < 2) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['nome'],
						message: 'Nome é obrigatório para CPF (mínimo 2 caracteres)',
					});
				}
				if (!data.sobrenome || data.sobrenome.length < 2) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['sobrenome'],
						message: 'Sobrenome é obrigatório para CPF (mínimo 2 caracteres)',
					});
				}
			}

			if (data.documento.length > 11) {
				if (!data.fantasia || data.fantasia.length < 2) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['fantasia'],
						message: 'Nome fantasia é obrigatório ',
					});
				}
				if (!data.razaoSocial || data.razaoSocial.length < 2) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['razaoSocial'],
						message: 'Razão social é obrigatória',
					});
				}
				if (!data.contato || data.contato.length < 2) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['contato'],
						message: 'Contato é obrigatório ',
					});
				}
			}
		});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),

		defaultValues: {
			fantasia: '',
			razaoSocial: '',
			contato: '',
			nome: '',
			sobrenome: '',
			dtNascimento: '',
			sexo: '',
			estadoCivil: '',
			email: '',
			documento: cpfCnpj(documentOfParam) || '',
			tipoTelefone: 'Celular',
			tipoUsuario: '2',
			ddi: '55',
			ddd: '11',
			numero: '99999-9999',
		},
	});

	const request = useApi<PessoaDataCurrent>({
		url: '/api/Pessoa',
	});

	const requestUser = useApi<DataUserCreate>({
		url: '/api/Usuario',
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const {
			documento,
			nome,
			sobrenome,
			sexo,
			estadoCivil,
			tipoTelefone,
			dtNascimento,
			tipoUsuario,
			numero,
			email,
			ddd,
			ddi,
			fantasia,
			razaoSocial,
			contato,
		} = values;

		const tipoPessoa =
			+documento.replace(/[^\d]+/g, '') > 11 ? 'Juridica' : 'Fisica';

		const payload = {
			tipoUsuario,
			tipoPessoa,
			pessoaEndereco: [],
			pessoaDocumento: [
				{
					tipoDocumento:
						+documento.replace(/[^\d]+/g, '') > 11 ? 'CNPJ' : 'CPF',
					numero: documento.replace(/[^\d]+/g, ''),
				},
			],
			pessoaTelefone: [
				{
					tipoTelefone,
					ddi: ddi || '55',
					ddd: ddd || '11',
					numero: numero.replace(/[^\d]+/g, '') || '9999999999',
				},
			],
			pessoaEmail: [
				{
					tipoEmail: 'Pessoal',
					email,
				},
			],
		} as unknown as PessoaDataCurrent;

		const pessoaFisica = {
			nome,
			sobrenome,
			dtNascimento,
			sexo,
			estadoCivil,
			snEstrangeiro: false,
		};

		const pessoaJuridica = {
			fantasia,
			razaoSocial,
			contato,
		};

		const isPessoaJuridica = !!fantasia;

		const data = isPessoaJuridica
			? {
					...payload,
					pessoaJuridica,
			  }
			: {
					...payload,
					pessoaFisica,
			  };

		if (pessoaID) {
			await onSaveUser(+pessoaID, tipoUsuario, email);
			return;
		}

		await request
			.sendRequest('post', data as unknown as PessoaDataCurrent)
			.then((data) => {
				if (data?.id) onSaveUser(+data.id, tipoUsuario, email);
			});
	}
	async function onSaveUser(
		pessoaID: number,
		tipoUsuario: string,
		login: string
	) {
		await requestUser
			.sendRequest('post', {
				pessoaID,
				tipoUsuario,
				login,
				senha: 'SDl@d' + document,
				corporacaoGuid: corporation?.corporacaoGuid,
			})
			.then(() => {
				form.reset();
				push('/prestadores/' + document.replace(/[^\d]+/g, ''));
				setLoadingPage(true);
			});
	}

	const handleChangeDocument = (e: ChangeEvent<HTMLInputElement>) => {
		setDocument(e.target.value.replace(/[^\d]+/g, ''));

		if (
			e.target.value.replace(/[^\d]+/g, '').length === 11 ||
			e.target.value.replace(/[^\d]+/g, '').length === 14
		)
			validateUser(
				e.target.value.replace(/[^\d]+/g, ''),
				corporation?.corporacaoGuid
			);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="w-full md:w-[300px] mt-4">
					<FormField
						control={form.control}
						name="documento"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Documento </FormLabel>
								<FormControl>
									<Input
										placeholder="Documento"
										{...field}
										value={cpfCnpj(document)}
										onInput={handleChangeDocument}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{loading && (
					<div className="flex align-center w-full p-2 gap-2">
						<Loader2 className="animate-spin" />
						Carregando...
					</div>
				)}

				{error && !loading && (
					<div className="flex align-center w-full p-2 gap-2">
						<AlertTriangle size={20} />
						{error}
					</div>
				)}
				{!error && (
					<>
						{document.length === 11 && (
							<div className="w-full flex flex-col md:flex-row gap-4">
								<FormField
									control={form.control}
									name="nome"
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
									name="sobrenome"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Sobrenome </FormLabel>
											<FormControl>
												<Input placeholder="Sobrenome" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
						{document.length > 11 && (
							<div className="w-full flex flex-col md:flex-row gap-4">
								<FormField
									control={form.control}
									name="fantasia"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Nome Fantasia</FormLabel>
											<FormControl>
												<Input placeholder="Nome Fantasia" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="razaoSocial"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Razão social </FormLabel>
											<FormControl>
												<Input placeholder="Razão social" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="contato"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Contato </FormLabel>
											<FormControl>
												<Input placeholder="Contato" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
						{document.length >= 11 && (
							<div className="w-full  md:grid md:grid-cols-[3fr_1fr_auto_auto_1fr] gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Login </FormLabel>
											<FormControl>
												<Input placeholder="Login" {...field} type="email" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="tipoTelefone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de telefone</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Tipo de telefone" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Celular">Celular</SelectItem>
													<SelectItem value="Trabalho">Trabalho</SelectItem>
													<SelectItem value="Residencial">
														Residencial
													</SelectItem>
													<SelectItem value="Outros">Outros</SelectItem>
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="ddi"
									render={({ field }) => (
										<FormItem>
											<FormLabel>DDI </FormLabel>
											<FormControl>
												<Input placeholder="DDI" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="ddd"
									render={({ field }) => (
										<FormItem>
											<FormLabel>DDD </FormLabel>
											<FormControl>
												<Input placeholder="DDD" {...field} />
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
											<FormLabel>Número </FormLabel>
											<FormControl>
												<Input placeholder="Número" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
						{document.length === 11 && (
							<div className="md:flex md:gap-4">
								<FormField
									control={form.control}
									name="dtNascimento"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Data do nascimento</FormLabel>

											<DatePicker
												value={field.value}
												onChange={field.onChange}
												placeholder="Data de nascimento"
											/>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="sexo"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gênero</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Gênero" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="NaoInformado">
														Não informado
													</SelectItem>
													<SelectItem value="Masculino">Masculino</SelectItem>
													<SelectItem value="Feminino">Feminino</SelectItem>
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="estadoCivil"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Estado civil</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Estado civil" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="NaoInformado">
														Não informado
													</SelectItem>
													<SelectItem value="Solteiro">Solteiro</SelectItem>
													<SelectItem value="Casado">Casado</SelectItem>
													<SelectItem value="Separado">Separado</SelectItem>
													<SelectItem value="Divorciado">Divorciado</SelectItem>
													<SelectItem value="Viuvo">Viuvo</SelectItem>
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						<div className="flex gap-2 justify-end">
							<Button type="submit">Salvar</Button>
						</div>
					</>
				)}
			</form>
		</Form>
	);
}
