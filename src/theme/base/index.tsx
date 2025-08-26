// import { AppSidebar } from './sidebar';

import { useRef, useState } from 'react';
import { Header } from './header';

// import { MenuAppSidebar } from './menu';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Menu } from './menu';
export default function Base({ children }: { children: React.ReactNode }) {
	const [isHovering, setIsHovering] = useState(false);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		hoverTimeoutRef.current = setTimeout(() => {
			setIsHovering(true);
		}, 200);
	};

	const handleMouseLeave = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		hoverTimeoutRef.current = setTimeout(() => {
			setIsHovering(false);
		}, 300);
	};
	return (
		<SidebarProvider defaultOpen={false} open={isHovering}>
			<Menu
				handleMouseLeave={handleMouseLeave}
				handleMouseEnter={handleMouseEnter}
			/>

			<SidebarInset>
				<Header handleMouseEnter={handleMouseEnter} />
				<div className="flex flex-1 flex-col gap-4 p-4 pt-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
