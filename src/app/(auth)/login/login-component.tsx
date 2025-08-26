import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/useAuth';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Autocomplete, DataOptions } from '@/components/ui/auto-complete';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useCorporation } from '@/providers/useCorporation';

interface Props {
	login: string;
	goBack?: () => void;
	list: DataOptions[];
	guid?: string;
	showEmail?: boolean;
}
export default function LoginComponent({
	login,
	list,
	guid,
	goBack,
	showEmail = false,
}: Props) {
	const { signIn } = useAuth();
	const { addCorporation } = useCorporation();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const formSchema = z.object({
		password: z.string().min(2, {
			message: 'Email must be at least 2 characters.',
		}),
		guid: z.string().min(2, {
			message: 'Email must be at least 2 characters.',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
			guid,
		},
	});


	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		handleCorporationChange(values.guid);
		await signIn(login, values.password, values.guid);
		router.push('/home');
		setTimeout(() => setLoading(false), 1000);
	}

	function handleCorporationChange(guid: string) {
		const corporation = list.find((item) => item.value === guid);
		if (corporation) {
			addCorporation(corporation);
		}
	}

	return (
		<div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{showEmail && (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input placeholder="login" readOnly value={login} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Senha</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Senha" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="guid"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Corporação</FormLabel>
								<FormControl>
									<Autocomplete
										options={list}
										placeholder="Selecione a coproração"
										{...field}
										formId="guid"
										value={guid}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <h2 className="text-lg font-medium mb-2">Standalone Autocomplete</h2>
        <Autocomplete
          options={countries}
          placeholder="Select a country"
          value={selectedCountry}
          onChange={setSelectedCountry}
        /> */}
					<div className="flex items-center justify-end gap-10">
						{goBack && (
							<Button variant="secondary" onClick={goBack}>
								Voltar
							</Button>
						)}
						<Button type="submit" disabled={loading}>
							Entrar
							{loading ? <Loader2 className="animate-spin" /> : ''}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
