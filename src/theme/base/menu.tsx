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
import { useCorporation } from '@/providers/useCorporation';
import { useAuth } from '@/providers/useAuth';

interface MenuAppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
}

export function Menu({
	handleMouseEnter,
	handleMouseLeave,
	...props
}: MenuAppSidebarProps) {
	const { corporation } = useCorporation();
	const { getRolesByPage } = useAuth();

	const data = {
		navMain: [
			{
				title: 'Home',
				url: '/home',
				items: [],
			},
			{
				title: 'Calendário',
				url: '/calendario',
				items: [],
			},
			{
				title: 'Usuários',
				url: '#',
				items: [
					{
						title: 'Pesquisa',
						url: '/usuarios',
					},
					{
						title: 'Cadastrar',
						url: '#',
					},
				],
			},
			{
				title: 'Cadastros',
				url: '#',
				items: [
					{
						title: 'Tipo de produto',
						url: '/produtos/tipos',
					},
					{
						title: 'Produtos',
						url: '/produtos',
					},

					{
						title: 'Tipo de ingressos',
						url: '/tipos-ingressos',
					},
					{
						title: 'Modelo de eventos',
						url: '/eventos/modelos',
					},
					getRolesByPage('eventos') && {
						title: 'Eventos',
						url: '/eventos',
					},
					{
						title: 'Catalogos',
						url: '/catalogos',
					},
				],
			},
			{
				title: 'Cupom',
				url: '/cupom',
				items: [],
			},
			{
				title: 'Galeria de imagens',
				url: '/galeria',
				items: [],
			},

			{
				title: corporation?.corporacaoID === 1 ? 'Corporações' : 'Configuração',
				url:
					corporation?.corporacaoID === 1
						? '/corporacoes'
						: `/configuracao/${corporation?.corporacaoGuid}`,
				items: [],
			},

			{
				title:
					corporation?.corporacaoID === 1 ? 'Permissionamento' : 'Permissões',
				url:
					corporation?.corporacaoID === 1
						? '/permissionamento'
						: `/permissoes/${corporation?.corporacaoID}`,
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
									<span className="font-semibold">SOU DA LIGA</span>
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
