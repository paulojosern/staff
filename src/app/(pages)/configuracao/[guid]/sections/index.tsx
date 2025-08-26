'use client';

import { Button } from '@/components/ui/button';
import { useAttribute } from '@/hooks/use-attribute';
import { DataCorporation } from '@/providers/useCorporation';
import { useEffect, useState } from 'react';
import { TypeSection } from './models';
import SectionsItem from './section-item';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormSection } from './form';
import { Section } from './content';

interface Data {
	secoes: TypeSection[];
}

interface Props {
	corporation: DataCorporation;
}
export default function ConfigurationSections({ corporation }: Props) {
	const [open, setOpen] = useState(false);
	const { attribute, addAttributes, corporacaoAtributoID } = useAttribute<Data>(
		corporation?.guid,
		'secoes'
	);

	const [values, setValues] = useState<TypeSection[]>([]);

	useEffect(() => {
		const data = attribute?.secoes as TypeSection[];
		setValues(data);
	}, [attribute]);

	const moveItem = (fromIndex: number, toIndex: number) => {
		setValues((prevItems) => {
			const newItems = [...prevItems];
			const [movedItem] = newItems.splice(fromIndex, 1);
			newItems.splice(toIndex, 0, movedItem);
			return newItems;
		});

		setValues(() => {
			const newItems = [...values];
			const [movedItem] = newItems.splice(fromIndex, 1);
			newItems.splice(toIndex, 0, movedItem);
			return newItems;
		});
	};

	const [edit, setEdit] = useState<string>('');

	const propsForm = {
		open,
		setOpen,
		corporacaoID: corporation?.corporacaoID,
		corporacaoAtributoID,
		addAttributes,
		secoes: values,
	};

	const propsItem = {
		open,
		setOpen,
		setEdit,
		corporacaoID: corporation?.corporacaoID,
		guid: corporation?.guid,
		addAttributes,
		secoes: values,
		moveItem,
	};

	return (
		<div className="flex flex-col">
			{!edit ? (
				<>
					<div className="mb-4">
						<Button onClick={() => setOpen(true)} color="default">
							Adicionar uma seção
						</Button>
						{open && <FormSection {...propsForm} />}
					</div>

					<div className="border rounded-md">
						<DndProvider backend={HTML5Backend}>
							{values?.map((item, index) => (
								<SectionsItem
									key={`${index}`} // Melhor key para itens com IDs repetidos
									item={item}
									index={index}
									cAtributoID={corporacaoAtributoID}
									// deleteItem={deleteItem}

									{...propsItem}
								/>
							))}
						</DndProvider>
					</div>
				</>
			) : (
				<Section
					guid={corporation?.guid}
					edit={edit}
					corporation={corporation}
					setEdit={setEdit}
				/>
			)}
		</div>
	);
}
