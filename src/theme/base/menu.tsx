import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useAuth } from '@/providers/useAuth';

interface DataNavMain {
	navMain: {
		title: string;
		url: string;
		items: {
			title: string;
			url: string;
		}[];
	}[];
}

interface MenuAppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
}

export function Menu({
	handleMouseEnter,
	handleMouseLeave,
	...props
}: MenuAppSidebarProps) {
	const { user } = useAuth();

	const data: DataNavMain = {
		navMain: [
			{
				title: 'Home',
				url: '/home',
				items: [],
			},
			{
				title: 'Alocações',
				url: '/alocacoes/' + user?.produtorId,
				items: [],
			},
			{
				title: 'Prestadores',
				url: '/prestadores',
				items: [],
			},
		],
	};

	return (
		<Sidebar
			variant="inset"
			{...props}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">STAFF</span>
									<span className="">v1.0.0</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.navMain.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<Link href={item.url} className="font-medium">
										{item.title}
									</Link>
								</SidebarMenuButton>
								{item.items?.length ? (
									<SidebarMenuSub>
										{item.items.map((item, i) => (
											<SidebarMenuSubItem key={i}>
												<SidebarMenuSubButton
													asChild
													// isActive={item.isActive || false}
													className="h-auto"
												>
													<Link href={item?.url || ''}>{item?.title}</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								) : null}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
