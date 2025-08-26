import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	Form,
	FormControl,
	FormDescription,
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

import useApi from '@/hooks/use-api';
import { useCorporation } from '@/providers/useCorporation';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { DataCatalogProductEvent } from '@/app/(pages)/catalogos/models';
import { DataEvents } from '@/app/(pages)/eventos/models';
import { formatDate } from '@/utils/formats';

import api from '@/lib/api/axios';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataCatalogProductEvent;
	mutate: () => void;
	catalogoProdutoId: number;
	events?: DataEvents[];
}

export function FormData({
	open,
	setOpen,
	item,
	mutate,
	events,
	catalogoProdutoId,
}: Props) {
	const { corporation } = useCorporation();
	const formSchema = z.object({
		eventosID: z.string({
			message: 'Obrigatório',
		}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			eventosID: item?.eventosID?.toString() || '',
		},
	});

	const [valuesform, setValues] = useState<DataCatalogProductEvent>(
		item ?? ({} as DataCatalogProductEvent)
	);

	function handleChange(name: string, value: string | boolean | number) {
		setValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	}

	const request = useApi<DataCatalogProductEvent>({
		url: '/api/CatalogoProdutoEvento',
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		save(item ? 'put' : 'post', values);
	}

	function save(method: 'post' | 'put', values: z.infer<typeof formSchema>) {
		const data = {
			catalogoProdutoId,
			corporacaoID: corporation?.corporacaoID,
			...item,
			...valuesform,
			...values,
		} as unknown as DataCatalogProductEvent;
		request.sendRequest(method, data).then(() => {
			mutate();
			setOpen(false);
		});
	}

	const [disabled, setDisabled] = useState(item ? false : true);
	const [error, setError] = useState('');

	const ValidationEvent = (id: string) => {
		const url = `/api/EventosTipoIngresso/List?eventosID=${id}`;
		api
			.get(url)
			.then((response) => {
				if (response.data.length > 0) {
					setDisabled(false);
					setError('');
				}
			})
			.catch(() => {
				setDisabled(true);
				setError('Evento sem ingresso');
			});
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[1125px] overflow-y-auto max-h-[90dvh]  text-left">
				<DialogHeader className="text-left">
					{item ? (
						<DialogTitle>{item.nome}</DialogTitle>
					) : (
						<DialogTitle>Evento</DialogTitle>
					)}
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				{error && (
					<Alert variant="destructive" className="border-red-300">
						<AlertCircleIcon />
						<AlertTitle>{error}</AlertTitle>
					</Alert>
				)}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{events && events?.length > 0 && (
							<FormField
								control={form.control}
								name="eventosID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Evento </FormLabel>
										<Select
											onValueChange={(e) => {
												field.onChange(e);
												ValidationEvent(e);
											}}
											defaultValue={field.value?.toString()}
											disabled={!!item}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{events?.map((e) => (
													<SelectItem
														key={e.eventosID}
														value={e?.eventosID?.toString()}
													>
														{e.nome} ( Data: {formatDate(e?.dataEvento)} -
														Início: {formatDate(e.dataInicio)} - Fim:{' '}
														{formatDate(e.dataFim)} )
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<div className="md:col-span-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4">
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Invisível</FormLabel>
									<FormDescription>Venda somente no PDV</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.invisivel}
										name="invisivel"
										onCheckedChange={(e) => handleChange('invisivel', e)}
									/>
								</FormControl>
							</FormItem>
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Venda liberada</FormLabel>
									<FormDescription>
										Libera venda no site de vendas
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.vendaLiberada}
										name="vendaLiberada"
										onCheckedChange={(e) => handleChange('vendaLiberada', e)}
									/>
								</FormControl>
							</FormItem>

							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Venda encerrada</FormLabel>
									<FormDescription>
										Encerra a venda no site de vendas
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.vendaEncerrada}
										name="vendaEncerrada"
										onCheckedChange={(e) => handleChange('vendaEncerrada', e)}
									/>
								</FormControl>
							</FormItem>
							<FormItem className="flex flex-row gap-2 justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Venda oculta</FormLabel>
									<FormDescription>
										PVisualização somente pelo link
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={valuesform?.vendaOculta}
										name="vendaOculta"
										onCheckedChange={(e) => handleChange('vendaOculta', e)}
									/>
								</FormControl>
							</FormItem>
						</div>

						<div className="flex justify-between gap-10 mt-6">
							<Button onClick={() => setOpen(false)} variant="secondary">
								Cancelar
							</Button>
							<Button type="submit" disabled={disabled}>
								Salvar
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
