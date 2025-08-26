import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/useAuth';
import { Button } from '@/components/ui/button';
import useApi from '@/hooks/use-api';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { PasswordInput } from '@/components/ui/input-password';

// import { useState } from 'react';

interface DataPassword {
	login: string;
	senha: string;
	confirmacao: string;
}

interface Props {
	login: string;
}

export default function TabPassword({ login }: Props) {
	const confirmationDialog = useConfirmationDialog();
	const { getRolesByPage } = useAuth();
	const roles = getRolesByPage('usuarios');
	const enabled = roles?.includes('user_register') || false;
	const [error, setError] = useState('');

	const [values, changeValues] = useState({
		login,
		senha: '',
		confirmacao: '',
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		changeValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	const validate = (value: string) => {
		const regex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#_$!%*?&])[A-Za-z\d@#_$!%*?&]{8,}$/;

		if (regex.test(value)) {
			setError('');
			if (value !== values.confirmacao) {
				setError('As senhas devem ser iguais');
			} else {
				onConfirm();
			}
		} else {
			setError('Senha inválida');
		}
	};
	async function onConfirm() {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  confirmar?`,
				confirmText: `Sim, confirmar`,
				cancelText: 'Não, cancelar',
			});
			onSubmit();
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	}

	const request = useApi<DataPassword>({
		url: '/api/usuario/AlteraSenha',
	});

	async function onSubmit() {
		await request.sendRequest('patch', values).then(() => {
			changeValues({
				login,
				senha: '',
				confirmacao: '',
			});
		});
	}

	return (
		<div>
			<ConfirmationDialog hook={confirmationDialog} />

			<div className="w-full md:w-1/3 flex flex-col  gap-4 mb-4 ">
				<div className="rounded-md p-4 px-8 bg-slate-100 dark:bg-slate-800 text-sm">
					A senha deve conter letra maiúscula, minúscula, caracter especial e
					número.
				</div>
				{error && (
					<div className="rounded-md p-4 px-8 bg-red-400 dark:bg-red-900">
						{error}
					</div>
				)}

				<div>
					<Label className="my-2">Senha</Label>
					<PasswordInput
						type="password"
						value={values?.senha}
						placeholder="senha"
						onInput={handleChange}
						name="senha"
						disabled={!enabled}
					/>
				</div>
				<div>
					<Label className="my-2">Confirmação</Label>
					<PasswordInput
						type="password"
						value={values?.confirmacao}
						placeholder="confirmacao"
						onInput={handleChange}
						name="confirmacao"
						disabled={!enabled}
					/>
				</div>
				<Button
					variant="default"
					className="ml-auto"
					disabled={!enabled || request.isLoading}
					onClick={() => validate(values.senha)}
				>
					Salvar
				</Button>
			</div>
		</div>
	);
}
