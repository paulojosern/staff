'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';
import TabProfile from './tabs/profile';
import { DataUserDetail, PessoaDataCurrent } from '../../models';
import TabAddress from './tabs/address';
import { KeyedMutator } from 'swr';
import TabPassword from './tabs/password';
import TabFacial from './tabs/facial';
import TabOrders from './tabs/orders';
import { useCorporation } from '@/providers/useCorporation';
import TabPermissions from './tabs/permissions';

// const GroupContent = dynamic(() => import('./group'), {
// 	ssr: false,
// });

interface Props {
	userSearch: DataUserDetail;
	pessoa: PessoaDataCurrent;
	mutate: KeyedMutator<unknown>;
}

export default function ResponsiveTabs({ userSearch, pessoa, mutate }: Props) {
	const [activeTab, setActiveTab] = useState('1');
	const { corporation } = useCorporation();

	const menuItems = [
		{
			id: '1',
			label: 'Dados Pessoais',
			component: <TabProfile userSearch={userSearch} pessoa={pessoa} />,
		},
		{
			id: '2',
			label: 'endereços',
			component: (
				<TabAddress userSearch={userSearch} pessoa={pessoa} mutate={mutate} />
			),
		},
		{
			id: '3',
			label: 'Senha',
			component: <TabPassword login={userSearch?.login} />,
		},
		{
			id: '4',
			label: 'Facial',
			component: <TabFacial pessoaID={pessoa?.pessoaID} />,
		},
		{
			id: '5',
			label: 'Pedidos',
			component: (
				<TabOrders
					guid={corporation?.corporacaoGuid}
					document={pessoa?.pessoaDocumento[0]?.numero}
				/>
			),
		},
		{
			id: '6',
			label: 'Permissões',
			component: (
				<TabPermissions
					corporacaoID={corporation?.corporacaoID}
					usuarioID={userSearch?.usuarioID?.toString()}
				/>
			),
		},
	];

	if (!userSearch || !pessoa) {
		return <div>Carregando...</div>;
	}

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
									value={item.id.toString()}
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
										const isActive = activeTab === item.id.toString();
										return (
											<button
												key={item.id}
												onClick={() => setActiveTab(item.id.toString())}
												className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-muted/50 ${
													isActive
														? 'bg-primary/10 text-primary rounded-sm'
														: 'text-muted-foreground'
												}`}
											>
												<span className="font-medium uppercase text-sm">
													{item.label}
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
								key={item.id}
								className={`${
									activeTab === item.id.toString() ? 'block' : 'hidden'
								}`}
							>
								<div>{item.component}</div>
							</div>
						))}
					</div>
				</div>

				{/* Mobile: Content below tabs */}
				<div className="md:hidden">
					{menuItems.map((item) => (
						<TabsContent
							key={item.id}
							value={item.id.toString()}
							className="mt-0"
						>
							<div className="py-2">{item.component}</div>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
}
