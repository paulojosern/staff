'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { CirclePlus } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

import { useCorporation } from '@/providers/useCorporation';
import { useState } from 'react';
import useFetch from '@/lib/api/swr';
import { TbReceiptTax } from 'react-icons/tb';

import { FormData } from './form';
import { DataCupom } from './models';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];

function CouponPage() {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);

	const url = `api/Cupom/List?CorporacaoGuid=${corporation?.corporacaoGuid}`;
	const { data, mutate } = useFetch<DataCupom[]>(url);

	return (
		<Pages title="Cupom" breadcrumb={dataBreadcrumb} icon={<TbReceiptTax />}>
			{open && <FormData open={open} setOpen={setOpen} mutate={mutate} />}

			<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  align-center  mb-2 mt-2">
				<Button variant="default" onClick={() => setOpen(true)}>
					<CirclePlus />
					Adicionar novo cupom
				</Button>
			</div>

			<div className="mx-auto py-2">
				{data && data?.length > 0 && (
					<DataTable
						columns={columns}
						data={data as DataCupom[]}
						mutate={mutate}
						propertySorter="codigoPromocional"
					/>
				)}
			</div>
		</Pages>
	);
}

export default AuthGuard(CouponPage);
