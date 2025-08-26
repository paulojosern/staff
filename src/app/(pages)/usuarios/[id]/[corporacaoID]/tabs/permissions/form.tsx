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

import api from '@/lib/api/axios';

import { KeyedMutator } from 'swr';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { DataUserPermissions, Group, Profile } from './model';
import useApi from '@/hooks/use-api';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mutate: KeyedMutator<DataUserPermissions[]>;
	usuarioID: string;
	corporacaoID?: number;
}

export function FormData({
	open,
	setOpen,
	mutate,
	corporacaoID,
	usuarioID,
}: Props) {
	const [groups, setGroups] = useState<Group[]>([]);
	const [profiles, setProfiles] = useState<Profile[]>([]);

	useEffect(() => {
		const getGroups = async () => {
			const url = `api/PermissaoGrupos/List?CorporacaoID=${corporacaoID}`;
			await api
				.get<Group[]>(url)
				.then((response) => {
					setGroups(response.data.filter((i) => i.ativo));
				})
				.catch(() => {
					setGroups([]);
				});
			// .finally(() => setItem(null))
		};
		getGroups();
	}, [corporacaoID]);

	const getProfile = async (permissaoGrupoID: string) => {
		const url = `api/PermissaoPerfil/List?PermissaoGrupoID=${permissaoGrupoID}`;
		await api
			.get<Profile[]>(url)
			.then((response) => {
				setProfiles(response.data.filter((i) => i.ativo));
			})
			.catch(() => {
				setProfiles([]);
			});
	};

	const formSchema = z.object({
		permissaoGrupoID: z.string({
			message: 'Obrigatório',
		}),
		permissaoPerfilID: z.string({
			message: 'Obrigatório',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const request = useApi<DataUserPermissions>({
		url: '/api/UsuarioPerfil',
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload = {
			usuarioID,
			...values,
		} as unknown as DataUserPermissions;
		await request.sendRequest('post', payload).then(() => {
			mutate();
			setOpen(false);
			form.reset();
		});
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Adicionar perfil</DialogTitle>
					<DialogDescription>
						Selecione o grupo e um perfil de permissões
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="permissaoGrupoID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Grupo</FormLabel>
										<Select
											onValueChange={(e) => {
												field.onChange(e);
												getProfile(e);
											}}
											defaultValue={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Grupo" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{groups.map((option) => (
													<SelectItem
														key={option.permissaoGrupoID}
														value={option.permissaoGrupoID.toString()}
													>
														{option.nomeGrupo}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>

							{profiles.length > 0 && (
								<FormField
									control={form.control}
									name="permissaoPerfilID"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Perfis</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Perfis" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{profiles?.map((item) => (
														<SelectItem
															key={item?.permissaoPerfilID}
															value={item?.permissaoPerfilID.toString()}
														>
															{item?.nomePerfil}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<DialogFooter>
							<Button onClick={() => setOpen(false)} variant="secondary">
								Cancelar
							</Button>
							<Button disabled={!form.formState.isValid} type="submit">
								Salvar
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
