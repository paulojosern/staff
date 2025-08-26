'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';

import Corporation from './corporation';
import { DataCorporation } from '@/providers/useCorporation';
import LayoutCorporation from './layout-corporation';
import Configuration from './configuration';
import ConfigurationPopUp from './pop-up';
import ConfigurationBanners from './banners';
import ConfigurationSections from './sections';
import { Layout } from './layout';

interface Props {
	corporation: DataCorporation;
}

export default function ResponsiveTabs({ corporation }: Props) {
	const [activeTab, setActiveTab] = useState('corporacao');

	const menuItems = [
		{
			id: 'corporacao',
			label: 'Corporação',
			component: <Corporation corporation={corporation} />,
		},
		{
			id: 'configurações',
			label: 'Configurações',
			component: <LayoutCorporation corporation={corporation} />,
		},

		{
			id: 'telas',
			label: 'Telas',
			component: <Configuration corporation={corporation} />,
		},

		{
			id: 'pop-ups',
			label: 'Pop-ups',
			component: <ConfigurationPopUp corporation={corporation} />,
		},

		{
			id: 'banners',
			label: 'Banners',
			component: <ConfigurationBanners corporation={corporation} />,
		},
		{
			id: 'sections',
			label: 'Seções',
			component: <ConfigurationSections corporation={corporation} />,
		},
		{
			id: 'layout',
			label: 'Layout',
			component: <Layout corporation={corporation} />,
		},
	];

	return (
		<div className="w-full mx-auto py-2">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Mobile: Horizontal scrollable tabs */}
				<div className="md:hidden">
					<TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-4 overflow-x-auto">
						{menuItems.map((item) => {
							return (
								<TabsTrigger
									key={item.id}
									value={item.id}
									className="flex flex-col items-center gap-1 p-2 text-xs whitespace-nowrap min-w-0"
								>
									<span className="truncate">{item.label}</span>
								</TabsTrigger>
							);
						})}
					</TabsList>
				</div>

				{/* Desktop: Vertical sidebar layout */}
				<div className="hidden md:flex md:gap-6">
					{/* Vertical Menu List */}
					<div className="w-64 flex-shrink-0">
						<div className="rounded-md border">
							<CardContent className="p-2 rounded-md">
								<div className="space-y-1">
									{menuItems.map((item) => {
										const isActive = activeTab === item.id;
										return (
											<button
												key={item.id}
												onClick={() => setActiveTab(item.id)}
												className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-muted/50 ${
													isActive
														? 'bg-primary/10 text-primary rounded-sm'
														: 'text-muted-foreground'
												}`}
											>
												<span className="font-medium">{item.label}</span>
											</button>
										);
									})}
								</div>
							</CardContent>
						</div>
					</div>

					{/* Content Area */}
					<div className="flex-1">
						{menuItems.map((item) => (
							<div
								key={item.id}
								className={`${activeTab === item.id ? 'block' : 'hidden'}`}
							>
								<div className="p-4">{corporation && item.component}</div>
							</div>
						))}
					</div>
				</div>

				{/* Mobile: Content below tabs */}
				<div className="md:hidden">
					{menuItems.map((item) => (
						<TabsContent key={item.id} value={item.id} className="mt-0">
							<div className="py-2">{corporation && item.component}</div>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
}
