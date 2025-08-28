import * as React from 'react';

import { useAuth } from '@/providers/useAuth';
import { DataCorporation, useCorporation } from '@/providers/useCorporation';
import { Autocomplete, DataOptions } from '@/components/ui/auto-complete';
import { CommandDialog } from '@/components/ui/command';
import LoginComponent from '@/app/(auth)/login/login-component';
import { constants } from '@/lib/constants';
import { getCookie } from 'cookies-next';
import { authService } from '@/lib/api/auth';
export function Corporations() {
	const { user } = useAuth();
	const { addCorporation } = useCorporation();
	const [loading, setLoading] = React.useState(false);
	const [list, setList] = React.useState<DataOptions[]>([]);
	const guid = getCookie(constants.GUID_COOKIE) as string;
	const [value, setValue] = React.useState(guid);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		if (user) {
			setOpen(false);
			getCorporations(user?.login);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	async function getCorporations(login: string | undefined) {
		const data = localStorage.getItem(constants.CORPORATIONS) as string;

		if (data) {
			const parsed = JSON.parse(data) as DataCorporation[];
			const list: DataOptions[] = parsed.map((item) => ({
				...item,
				value: item.corporacaoGuid,
				label: item.corporacaoNome,
			}));
			setList(list);
			const find = parsed.find(
				(item: DataCorporation) => item.corporacaoGuid === guid
			) as DataCorporation;
			addCorporation(find);
			return;
		}

		setLoading(true);

		await authService
			.getCorporations(login as string)
			.then((res) => {
				if (res) {
					const data: DataOptions[] = res.map((item) => ({
						...item,
						value: item.corporacaoGuid,
						label: item.corporacaoNome,
					}));
					setList(data);
					const find = res.find(
						(item) => item.corporacaoGuid === guid
					) as DataCorporation;
					addCorporation(find);
					localStorage.setItem(constants.CORPORATIONS, JSON.stringify(res));
				}
			})
			.finally(() => setLoading(false));
	}

	function onSelect(value: string) {
		setValue(value);
		setOpen(true);
		console.log(value);
	}

	if (loading) {
		return <div>Carregando...</div>;
	}

	return (
		<>
			<CommandDialog open={open} onOpenChange={setOpen}>
				{/* <CommandInput placeholder="Type a command or search..." /> */}
				<div className="p-10 ">
					<LoginComponent login={user?.login || ''} list={list} guid={value} />
				</div>
			</CommandDialog>
			{list && list.length > 0 && (
				<Autocomplete
					options={list}
					placeholder="Selecione a coproração"
					value={value}
					formId="guid"
					onChange={onSelect}
				/>
			)}
		</>
	);
}
