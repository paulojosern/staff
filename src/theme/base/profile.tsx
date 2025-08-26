'use client';

import * as React from 'react';
import { LogOut, MoreHorizontal, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/providers/useAuth';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/elements/themeMode';

export default function Profile() {
	const { user, logout } = useAuth();
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<div className="flex items-center gap-2 text-sm">
			<div className="hidden font-medium text-muted-foreground md:inline-block">
				{user?.nome}
			</div>
			<Badge variant="secondary">{user?.tipousuario}</Badge>
			<ModeToggle />
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 data-[state=open]:bg-accent"
					>
						<MoreHorizontal />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-56 overflow-hidden rounded-lg p-0"
					align="end"
				>
					<Sidebar collapsible="none" className="bg-transparent">
						<SidebarContent>
							<SidebarGroup className="border-b last:border-none">
								<SidebarGroupContent className="gap-0">
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton>
												<User /> <span>Minha conta</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
							<SidebarGroup className="border-b last:border-none">
								<SidebarGroupContent className="gap-0">
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton onClick={logout}>
												<LogOut /> <span>Sair</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
				</PopoverContent>
			</Popover>
		</div>
	);
}
