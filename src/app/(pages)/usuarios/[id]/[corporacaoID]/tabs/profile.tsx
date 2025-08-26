import { Input } from '@/components/ui/input';
import {
	DataUserDetail,
	PessoaDataCurrent,
	PessoaFisicaData,
} from '../../../models';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import ProfileLogin from './profile-login';
import { useAuth } from '@/providers/useAuth';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import useApi from '@/hooks/use-api';
import ProfilePhone from './profile-phone';

// import { useState } from 'react';
interface Props {
	userSearch: DataUserDetail;
	pessoa: PessoaDataCurrent;
}

export default function TabProfile({ userSearch, pessoa }: Props) {
	const { getRolesByPage } = useAuth();
	const roles = getRolesByPage('usuarios');

	const enabled = roles?.includes('user_register') || false;
	const [pessoaFisica, setPessoaFisica] = useState<PessoaFisicaData>(
		pessoa?.pessoaFisica
	);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPessoaFisica({
			...pessoaFisica,
			[e.target.name]: e.target.value,
		});
	};

	const handleChangeName = (name: string, value: string) => {
		setPessoaFisica({
			...pessoaFisica,
			[name]: value,
		});
	};

	const request = useApi<PessoaDataCurrent>({
		url: '/api/pessoa',
	});

	async function onSubmit() {
		const payload = {
			...pessoa,
			pessoaFisica,
		};

		await request.sendRequest('put', payload);
	}

	return (
		<div>
			<ProfileLogin userSearch={userSearch} enabled={enabled} />

			<div className="w-full flex flex-col md:grid md:grid-cols-2 gap-4 mb-4 ">
				<div>
					<Label className="my-2">Nome</Label>
					<Input
						value={pessoaFisica?.nome}
						placeholder="Nome"
						onInput={handleChange}
						name="nome"
						disabled={!enabled}
					/>
				</div>
				<div>
					<Label className="my-2">Sobrenome</Label>
					<Input
						value={pessoaFisica?.sobrenome}
						placeholder="sobrenome"
						onInput={handleChange}
						name="sobrenome"
						disabled={!enabled}
					/>
				</div>
			</div>
			<div className="w-full flex flex-col md:grid md:grid-cols-4 gap-4 mb-4 ">
				<div>
					<Label className="my-2">Data de Nascimento</Label>
					<DatePicker
						value={pessoaFisica?.dtNascimento}
						onChange={(e) => {
							handleChangeName('dtNascimento', e as string);
						}}
						disabled={!enabled}
					/>
				</div>

				<div>
					<Label className="my-2">Gênero</Label>

					<Select
						value={pessoaFisica?.sexo}
						onValueChange={(e) => handleChangeName('sexo', e)}
						disabled={!enabled}
						// defaultValue={field.value?.toString()}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Gênero" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="Masculino">Masculino</SelectItem>
							<SelectItem value="Feminino">Feminino</SelectItem>
							<SelectItem value="NaoInformado">Não informado</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="my-2">Estado Civil</Label>
					<Select
						value={pessoaFisica?.estadoCivil}
						onValueChange={(e) => handleChangeName('estadoCivil', e)}
						disabled={!enabled}
						// defaultValue={field.value?.toString()}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Estado civil" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="Solteiro">Solteiro</SelectItem>
							<SelectItem value="Casado">Casado</SelectItem>
							<SelectItem value="Separado">Separado</SelectItem>
							<SelectItem value="Divorciado">Divorciado</SelectItem>
							<SelectItem value="Viuvo">Viuvo</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="my-2">Nacionalidade</Label>
					<Select
						value={pessoaFisica?.nacionalidade}
						onValueChange={(e) => handleChangeName('nacionalidade', e)}
						disabled={!enabled}
						// defaultValue={field.value?.toString()}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Estado civil" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="Brasil">Brasil</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex">
				<Button
					variant="default"
					className="ml-auto"
					disabled={!enabled || request.isLoading}
					onClick={onSubmit}
				>
					Salvar
				</Button>
			</div>
			<ProfilePhone pessoa={pessoa?.pessoaTelefone?.[0]} enabled={enabled} />
		</div>
	);
}
