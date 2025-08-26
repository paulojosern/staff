'use client';

import useFetch from '@/lib/api/swr';
import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { Settings2 } from 'lucide-react';
import { use } from 'react';
import ResponsiveTabs from './tabs';
import { DataCorporation } from '@/providers/useCorporation';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

interface Props {
	params: Promise<{ guid: string }>;
}

function ConfigurationPage({ params }: Props) {
	const { guid } = use(params);

	const url = `/api/corporacao?CorporacaoGuid=${guid}`;
	const { data } = useFetch(url);

	return (
		<Pages
			title={`Configuração`}
			breadcrumb={dataBreadcrumb}
			icon={<Settings2 />}
		>
			<ResponsiveTabs corporation={data as DataCorporation} />
		</Pages>
	);
}
export default AuthGuard(ConfigurationPage);
