'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	console.log(user);

	return (
		<SidebarMenu>
			<SidebarMenuItem>kkkkkkkk</SidebarMenuItem>
		</SidebarMenu>
	);
}
