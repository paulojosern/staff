'use client';

import useFetch from '@/lib/api/swr';

// import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formateReal } from '@/utils/formats';
import { Skeleton } from '@/components/ui/skeleton';

// import Link from 'next/link';
// import { FiChevronRight } from 'react-icons/fi';

export type CardTemplateProps = {
	url: string;
	path: string;
	icon: React.ReactNode;
	title: string;
	currency?: boolean;
	description?: string;
	link?: string;
};

interface DataType {
	[key: string]: string;
}

export default function Widget({
	url,
	path,
	icon,
	title,
	description,
	currency = false,
}: CardTemplateProps) {
	const { data } = useFetch<DataType>(url);

	const formatPoint = (value: string, currency = false) => {
		const convert = new Intl.NumberFormat('ja-JP', {
			style: 'currency',
			currency: 'JPY',
			currencyDisplay: 'code',
		});
		return currency
			? formateReal(value)
			: convert
					.format(parseFloat(value))
					.replace('JPY', '')
					.replaceAll(',', '.')
					.trim();
	};

	if (!data) {
		return <Skeleton className="h-[150px] w-full rounded-xl" />;
	}

	return (
		<Card className="@container/card">
			<CardHeader className="relative">
				<div className="text-1xl font-semibold tabular-nums">{title}</div>
				<div className="flex align-center justify-between">
					<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
						<div>{data ? formatPoint(data?.[path], currency) : 0}</div>
					</CardTitle>
					{icon}
				</div>
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1 text-sm">
				<div className="line-clamp-1 flex gap-2 font-medium">{description}</div>
			</CardFooter>
		</Card>
	);
}
