import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import api from '@/lib/api/axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { DataOptions } from '@/components/ui/auto-complete';
import { Loader2 } from 'lucide-react';
import { DataCorporation } from '@/providers/useCorporation';

interface Props {
	setList: Dispatch<SetStateAction<DataOptions[]>>;
	setLogin: Dispatch<SetStateAction<string>>;
}

export default function Corporations({ setList, setLogin }: Props) {
	const formSchema = z.object({
		email: z.string().min(2, {
			message: 'Email must be at least 2 characters.',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	const [loading, setLoading] = useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		const url = `api/Usuario/ListCorporacoes?Login=${values.email}`;
		api
			.get<DataCorporation[]>(url)
			.then((res) => {
				const data: DataOptions[] = res.data.map((item) => ({
					...item,
					value: item.corporacaoGuid,
					label: item.corporacaoNome,
				}));
				setLogin(values.email);
				setList(data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input placeholder="login" {...field} />
							</FormControl>
							<FormDescription>
								Informe seu e-mail para buscar a corporação
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={loading}>
					Buscar corporação
					{loading ? <Loader2 className="animate-spin" /> : ''}
				</Button>
			</form>
		</Form>
	);
}
