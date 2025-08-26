'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';
import { Group } from '../models';
import dynamic from 'next/dynamic';
import { KeyedMutator } from 'swr';
const GroupContent = dynamic(() => import('./group'), {
	ssr: false,
});

interface Props {
	menuItems: Group[];
	mutate: KeyedMutator<Group[]>;
}

export default function ResponsiveTabs({ menuItems, mutate }: Props) {
	const [activeTab, setActiveTab] = useState('corporacao');

	return (
		<div className="w-full mx-auto py-2">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Mobile: Horizontal scrollable tabs */}
				<div className="md:hidden">
					<TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-4 overflow-x-auto">
						{menuItems.map((item) => {
							return (
								<TabsTrigger
									key={item.permissaoGrupoID}
									value={item.permissaoGrupoID.toString()}
									className="flex flex-col items-center gap-1 p-2 text-xs whitespace-nowrap min-w-0"
								>
									<span className="truncate">{item.nomeGrupo}</span>
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
										const isActive =
											activeTab === item.permissaoGrupoID.toString();
										return (
											<button
												key={item.permissaoGrupoID}
												onClick={() =>
													setActiveTab(item.permissaoGrupoID.toString())
												}
												className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-muted/50 ${
													isActive
														? 'bg-primary/10 text-primary rounded-sm'
														: 'text-muted-foreground'
												}`}
											>
												<span className="font-medium uppercase text-sm">
													{item.nomeGrupo}
												</span>
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
								key={item.permissaoGrupoID}
								className={`${
									activeTab === item.permissaoGrupoID.toString()
										? 'block'
										: 'hidden'
								}`}
							>
								<div className="px-4">
									<GroupContent item={item} mutate={mutate} />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Mobile: Content below tabs */}
				<div className="md:hidden">
					{menuItems.map((item) => (
						<TabsContent
							key={item.permissaoGrupoID}
							value={item.permissaoGrupoID.toString()}
							className="mt-0"
						>
							<div className="py-2">
								<GroupContent item={item} mutate={mutate} />
							</div>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
}
