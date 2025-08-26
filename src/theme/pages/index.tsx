import { Slash } from 'lucide-react';
import Base from '../base';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export interface DataBreadcrumb {
	title: string;
	url: string;
}

interface Props {
	children: React.ReactNode;
	icon: React.ReactNode;
	title: React.ReactNode | string;
	breadcrumb: DataBreadcrumb[];
}

export default function Pages({ children, title, breadcrumb, icon }: Props) {
	return (
		<Base>
			<div className="px-2">
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumb?.map((item, index) => (
							<span className="flex items-center gap-2" key={index}>
								<BreadcrumbItem>
									<Link href={item.url}>{item.title}</Link>
								</BreadcrumbItem>
								<BreadcrumbSeparator>
									<Slash />
								</BreadcrumbSeparator>
							</span>
						))}

						<BreadcrumbItem>
							<BreadcrumbPage>{title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<div className="border-b-1  pb-3 pt-4 text-2xl flex items-center gap-4">
					{icon}
					{title}
				</div>
				<div className="pt-2">{children}</div>
			</div>
		</Base>
	);
}
