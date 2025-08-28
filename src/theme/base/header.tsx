import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import * as React from 'react';
import { Corporations } from './corporations';
import Profile from './profile';

interface Props {
	handleMouseEnter: () => void;
}

export function Header({ handleMouseEnter }: Props) {
	// const { corporation } = useCorporation();
	return (
		<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
			<div className="flex items-center gap-2 px-3">
				<SidebarTrigger onMouseEnter={handleMouseEnter} />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb className="hidden md:block">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">
								<h2>Corporação</h2>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>
								<Corporations />
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex items-center gap-2 px-3">
				<Profile />
			</div>
		</header>
	);
}
