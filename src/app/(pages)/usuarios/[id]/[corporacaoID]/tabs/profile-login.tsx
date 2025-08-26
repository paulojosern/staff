import { Input } from '@/components/ui/input';
import { DataUserDetail } from '../../../models';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useApi from '@/hooks/use-api';

interface Props {
	userSearch: DataUserDetail;
	enabled: boolean;
}

export default function ProfileLogin({ userSearch, enabled }: Props) {
	const [login, setLogin] = useState<string>('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLogin(e.target.value);
	};

	const request = useApi<{
		usuarioID: string;
		login: string;
		ativo: boolean;
		tipoUsuario: string;
	}>({
		url: '/api/usuario',
	});

	async function onSubmit() {
		await request.sendRequest('put', {
			ativo: userSearch.ativo,
			tipoUsuario: userSearch?.tipoUsuario,
			usuarioID: userSearch?.usuarioID?.toString(),
			login,
		});
	}

	return (
		<div className="w-full mx-auto py-2  mb-5">
			<Label className="mb-2">Login</Label>
			<div className="flex flex-col md:grid md:grid-cols-[40rem_5rem] gap-4">
				<Input
					value={login || userSearch.login}
					placeholder="Login"
					onInput={handleChange}
					disabled={!enabled}
				/>
				<Button
					variant="default"
					onClick={onSubmit}
					className="ml-auto"
					disabled={login.length === 0 || !enabled || request.isLoading}
				>
					Salvar
				</Button>
			</div>
		</div>
	);
}
