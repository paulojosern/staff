'use client';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import DraggableItem from './item';
import { Button } from '@/components/ui/button';

import { useAttribute } from '@/hooks/use-attribute';

import { DataCorporation } from '@/providers/useCorporation';
import { useEffect, useState } from 'react';
import { FormData } from './form';
import { CirclePlus } from 'lucide-react';

interface Data {
	banners: Banners[];
}

export interface Banners {
	id: string;
	link: string;
	public_id: string;
}

interface Props {
	corporation: DataCorporation;
}
export default function ConfigurationBanners({ corporation }: Props) {
	const [open, setOpen] = useState(false);
	const { attribute, addAttributes, corporacaoAtributoID, remove } =
		useAttribute<Data>(corporation?.guid, 'banners');

	const [values, setValues] = useState<Banners[]>([]);

	useEffect(() => {
		const data = attribute?.banners as Banners[];
		setValues(data);
	}, [attribute]);

	const onSelection = (item: string) => {
		onChange(item);
		setOpen(false);
	};

	function onChange(public_id: string) {
		const data = {
			id: uuidv4(),
			link: '',
			public_id,
		};

		if (corporacaoAtributoID) {
			const banners = [...values, data];
			setValues(banners);
			onSubmit(JSON.stringify({ banners }), 'banners', corporacaoAtributoID);
		} else {
			setValues([data]);
			onSubmit(JSON.stringify({ banners: [data] }), 'banners');
		}
	}

	const deleteItem = (id: string) => {
		const banners = values.filter((i) => i.id !== id);
		setValues(banners);

		if (banners.length === 0) {
			remove(corporacaoAtributoID);
		} else {
			onSubmit(JSON.stringify({ banners }), 'banners', corporacaoAtributoID);
		}
	};

	const onSubmit = async (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number
	) => {
		await addAttributes(
			valor,
			chave,
			corporacaoAtributoID,
			corporation?.corporacaoID
		);
	};

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

	return (
		<div className="flex flex-col">
			{open && (
				<FormData open={open} setOpen={setOpen} onSelection={onSelection} />
			)}

			<div className="mb-2 mt-2 md:px-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar imagem
				</Button>
			</div>
			<div className="py-2">
				<DndProvider backend={HTML5Backend}>
					{values?.map((item, index) => (
						<DraggableItem
							key={`${item.id}-${index}`} // Melhor key para itens com IDs repetidos
							item={item}
							index={index}
							moveItem={moveItem}
							deleteItem={deleteItem}
						/>
					))}
				</DndProvider>
			</div>
		</div>
	);
}
