// import { useCallback, useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

// import { FiChevronUp } from 'react-icons/fi';

import { DataCorporation } from '@/providers/useCorporation';
import { useAttribute } from '@/hooks/use-attribute';
import { Data, DataGeneric } from './models';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutContentHome } from './home';
import { LayoutContentFooter } from './footer';
import { LayoutContentGeneric } from './generic';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { FiChevronUp } from 'react-icons/fi';

type PropsAttributes = {
	corporation: DataCorporation;
};

// Formulario alteração e criação
export function Layout({ corporation }: PropsAttributes) {
	const confirmationDialog = useConfirmationDialog();
	const [page, setPage] = useState({
		open: false,
		home: false,
		footer: false,
		maps: false,
		generic: false,
	});

	const [items, setItems] = useState<DataGeneric[]>([]);

	const { attribute, addAttributes, corporacaoAtributoID } = useAttribute<Data>(
		corporation.guid,
		'layout_dinamic'
	);

	useEffect(() => {
		if (attribute) {
			const i = Object.entries(attribute)
				.filter(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					([key, value]) => !key.includes('home') && !key.includes('rodape')
				)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
				.map(([key, value]) => value) as any[];

			const rest = i
				.sort((a, b) => a.order - b.order)
				.map((item, i) => {
					let index = i + 2;
					return {
						...item,
						order: index++,
					};
				});

			setItems(rest);
		}
	}, [attribute]);

	const [generic, setGeneric] = useState<DataGeneric>();

	const showPage = (item: string) => {
		const disabled = Object.keys(page).reduce(
			(attrs, key) => ({
				...attrs,
				[key]: false,
			}),
			{}
		) as unknown as typeof page;

		setPage({
			...disabled,
			open: true,
			[item]: true,
		});
	};

	const hidePages = () => {
		const disabled = Object.keys(page).reduce(
			(attrs, key) => ({
				...attrs,
				[key]: false,
			}),
			{}
		) as unknown as typeof page;

		setPage(disabled);
	};

	//context

	const addContext = () => {
		const id = uuidv4();

		const data = {} as DataGeneric;

		setItems([
			...items,
			{
				...data,
				id,
			},
		]);
	};

	const removeContext = (context: DataGeneric) => {
		if (context?.nome) {
			const data = items.filter((item) => item.id !== context.id);
			setItems(data);
			onDelete(data);
			// handleConfirm(context.id);
		} else {
			const data = items.filter((item) => item.id !== context.id);
			setItems(data);
		}
	};

	const onDelete = async (data: DataGeneric[]) => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  excluir?`,
				confirmText: `Sim, excluir`,
				cancelText: 'Não, cancelar',
			});
			addAttributes(
				JSON.stringify(data),
				'layout_dinamic',
				corporacaoAtributoID,
				corporation?.corporacaoID
			);
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

	// const add = useCallback(async () => {
	// 	const values = {
	// 		home: {
	// 			order: 1,
	// 		},
	// 		rodape: {
	// 			order: 99,
	// 		},
	// 		events: {
	// 			order: 2,
	// 			nome: 'Eventos',
	// 			uuid: 'events',
	// 			edit: false,
	// 		},
	// 		maps: {
	// 			order: 3,
	// 			nome: 'Mapa',
	// 			uuid: 'maps',
	// 			edit: true,
	// 		},
	// 		secoes: {
	// 			nome: 'Seções',
	// 			uuid: 'secoes',
	// 			order: 4,
	// 		},
	// 	};

	// 	const valor = JSON.stringify(values);

	// 	try {
	// 		const response = await api.post('api/CorporacaoAtributo', {
	// 			corporacaoID,
	// 			chave: 'layout_dinamic',
	// 			valor,
	// 			snChavePrivada: false,
	// 			idInclusao: user?.usuarioID.toString(),
	// 		});
	// 		if (response) {
	// 			setLoading(false);
	// 			getData(signal);
	// 		}
	// 	} catch (error) {
	// 		setLoading(false);
	// 	}
	// }, []);

	const handleFirst = (item: DataGeneric) => {
		const index = items.findIndex((i) => i.order === item.order);

		const arr = moveElement(items, index, index - 1);
		const ordened = arr.map((item, i) => {
			let index = i + 2;
			return {
				...item,
				order: index++,
			};
		});

		setItems(ordened);

		const result = ordened.reduce((acc, country) => {
			const { uuid, id } = country;

			return { ...acc, [uuid || id]: country };
		}, {});

		addAttributes(
			JSON.stringify(result),
			'layout_dinamic',
			corporacaoAtributoID,
			corporation?.corporacaoID
		);
	};

	function moveElement(
		array: DataGeneric[],
		fromIndex: number,
		toIndex: number
	) {
		const arrayCopy = [...array];
		const element = arrayCopy.splice(fromIndex, 1)[0];

		arrayCopy.splice(toIndex, 0, element);

		return arrayCopy;
	}

	return (
		<div>
			<ConfirmationDialog hook={confirmationDialog} />
			{!page.open && (
				<div>
					<div className="flex flex-col gap-2">
						<div className="border border-gray-400 border-dashed flex justify-between p-4 items-center rounded-md">
							<div className="text-lg font-medium">Home</div>
							<Button
								variant="secondary"
								color="primary"
								onClick={() => {
									showPage('home');
								}}
							>
								Editar
							</Button>
						</div>
						{items
							?.sort((a, b) => a.order - b.order)
							.map((i, index) => {
								const enabled = (i?.uuid && i?.edit) || i?.id;
								return (
									<div
										className="border border-gray-400  flex justify-between p-4 items-center rounded-md"
										key={index}
									>
										<div className="text-lg font-medium">{i.nome}</div>
										<div className="flex gap-2">
											{enabled && (
												<Button
													variant="secondary"
													color="primary"
													onClick={() => {
														setGeneric(i);
														showPage(i?.uuid || 'generic');
													}}
												>
													{i.nome ? 'Editar' : 'Criar'}
												</Button>
											)}
											{i?.id && (
												<Button
													variant="secondary"
													color="primary"
													onClick={() => {
														removeContext(i);
													}}
												>
													Excluir
												</Button>
											)}
											{index !== 0 ? (
												<Button
													variant="secondary"
													onClick={() => handleFirst(i)}
												>
													<FiChevronUp />
												</Button>
											) : (
												<div style={{ width: 50 }}></div>
											)}
										</div>
									</div>
								);
							})}

						<div className="border border-gray-400 border-dashed  flex justify-between p-4 items-center rounded-md">
							<div className="text-lg font-medium">Rodapé</div>
							<Button
								variant="secondary"
								color="primary"
								onClick={() => {
									showPage('footer');
								}}
							>
								Editar
							</Button>
						</div>
					</div>
					<div className="p-4 text-center w-full">
						<Button variant="secondary" color="primary" onClick={addContext}>
							Adicionar contexto
						</Button>
					</div>
				</div>
			)}
			{page?.home && (
				<LayoutContentHome
					corporation={corporation}
					data={attribute as Data}
					hidePages={hidePages}
					addAttributes={addAttributes}
					corporacaoAtributoID={corporacaoAtributoID}
				></LayoutContentHome>
			)}
			{page?.footer && (
				<LayoutContentFooter
					corporation={corporation}
					data={attribute as Data}
					hidePages={hidePages}
					addAttributes={addAttributes}
					corporacaoAtributoID={corporacaoAtributoID}
				></LayoutContentFooter>
			)}
			{/* 
      {data && page?.footer && (
        <LayoutFooter
          corporacaoID={corporacaoID}
          data={data}
          hidePages={hidePages}
          corporacaoAtributoID={corporacaoAtributoID}
        ></LayoutFooter>
      )}

      {data && page?.maps && (
        <LayoutMaps
          corporacaoID={corporacaoID}
          data={data}
          hidePages={hidePages}
          corporacaoAtributoID={corporacaoAtributoID}
        ></LayoutMaps>
      )}
*/}
			{page?.generic && (
				<LayoutContentGeneric
					generic={generic}
					addAttributes={addAttributes}
					corporation={corporation}
					data={attribute as Data}
					hidePages={hidePages}
					corporacaoAtributoID={corporacaoAtributoID}
				></LayoutContentGeneric>
			)}
		</div>
	);
}
