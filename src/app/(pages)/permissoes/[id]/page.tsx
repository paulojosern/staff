'use client';

import { Button } from '@/components/ui/button';
import useFetch from '@/lib/api/swr';
import Pages from '@/theme/pages';
import { Lock } from 'lucide-react';
import { use, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Group } from '../models';
import ResponsiveTabs from './tabs';
import dynamic from 'next/dynamic';

const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	ssr: false,
});

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

interface Props {
	params: Promise<{ id: string }>;
}

export default function PermissaoPage({ params }: Props) {
	const { id } = use(params);
	const [open, setOpen] = useState(false);
	// const [item, setItem] = useState<Group | null>(null);

	const url = `api/PermissaoGrupos/List?CorporacaoID=${id}`;
	const { data, mutate } = useFetch<Group[]>(url);

	const propsForm = {
		open,
		setOpen,
		mutate,
	};

	return (
		<Pages title="Permissões" breadcrumb={dataBreadcrumb} icon={<Lock />}>
			<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  justify-between mb-2 mt-2">
				<Button
					onClick={() => {
						setOpen(true);
					}}
					variant="default"
				>
					Adicionar novo grupo <FiPlus />
				</Button>
			</div>
			<div className="mx-auto py-2">
				{data?.length && <ResponsiveTabs menuItems={data} mutate={mutate} />}
			</div>
			{open && <FormData {...propsForm} />}
		</Pages>
	);
}
