'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Loader2, UserPlus } from 'lucide-react';
import { use, useState } from 'react';
import { FormData } from './form';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

interface Props {
	params: Promise<{ documentOfParam: string }>;
}

function UserRegister({ params }: Props) {
	const { documentOfParam } = use(params);
	const [loadingPage, setLoadingPage] = useState<boolean>(false);
	if (loadingPage) {
		return (
			<div className="font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
				<Loader2 className="animate-spin" size={30} />
				redirecionando...
			</div>
		);
	}
	return (
		<Pages
			title="Cadastro de usuário"
			breadcrumb={dataBreadcrumb}
			icon={<UserPlus />}
		>
			<FormData
				documentOfParam={documentOfParam}
				setLoadingPage={setLoadingPage}
			/>
		</Pages>
	);
}

export default AuthGuard(UserRegister);
