import { Input } from '@/components/ui/input';
import { PessoaTelefoneData } from '../../../models';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useApi from '@/hooks/use-api';

interface Props {
	pessoa: PessoaTelefoneData;
	enabled: boolean;
}

export default function ProfilePhone({ pessoa, enabled }: Props) {
	const [values, setValues] = useState<PessoaTelefoneData>(pessoa);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({
			...values,
			[e.target.name]: e.target.value,
		});
	};

	const request = useApi<PessoaTelefoneData>({
		url: '/api/Pessoa/Telefone',
	});

	async function onSubmit() {
		await request.sendRequest('put', values);
	}

	return (
		<div className="w-full mx-auto py-4 border-t mt-5">
			<Label className="mb-2">Telefone</Label>
			<div className="flex flex-col md:grid md:grid-cols-[4rem_4rem_15rem_5rem] gap-4">
				<Input
					value={values.ddi}
					placeholder="DDI"
					name="ddi"
					onInput={handleChange}
					disabled={!enabled}
				/>
				<Input
					value={values.ddd}
					placeholder="DDD"
					name="ddd"
					onInput={handleChange}
					disabled={!enabled}
				/>
				<Input
					value={values.numero}
					placeholder="Número"
					name="numero"
					onInput={handleChange}
					disabled={!enabled}
				/>
				<Button
					variant="default"
					onClick={onSubmit}
					className="ml-auto"
					disabled={!enabled || request.isLoading}
				>
					Salvar
				</Button>
			</div>
		</div>
	);
}
