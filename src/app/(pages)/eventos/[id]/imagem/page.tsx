'use client';

import { useCorporation } from '@/providers/useCorporation';
import { use } from 'react';
import Pages from '@/theme/pages';
import { Calendar, CirclePlus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataEvents } from '../../models';
import api from '@/lib/api/axios';
import AuthGuard from '@/services/guard/authGuard';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import useApi from '@/hooks/use-api';

import DraggableItem from './item';
import { Button } from '@/components/ui/button';
import { FormData } from './form';

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
	{
		title: 'Eventos',
		url: '/eventos',
	},
];

export interface DataImageItem {
	id: string;
	public_id: string;
	decrição?: string;
}

interface Props {
	params: Promise<{ id: string }>;
}

function EventEditImagePage({ params }: Props) {
	const { id } = use(params);
	const { corporation } = useCorporation();
	const [loading, setLoading] = useState(true);
	const [row, setRow] = useState<DataEvents>();
	const [title, setTitle] = useState<string>('');
	const [data, setData] = useState<DataImageItem[]>([]);
	const [modify, setModify] = useState<DataImageItem[]>([]);
	const [item, setItem] = useState<DataImageItem | null>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getData = async () => {
		const url = `/api/Eventos?EventosID=${id}`;
		await api
			.get(url)
			.then((response) => {
				setRow(response.data);
				setTitle(response.data.nome);
				if (response.data.imagemEvento) {
					const images = JSON.parse(response.data.imagemEvento);
					setData(images);
				} else {
					setData([]);
				}
			})
			.catch(() => {
				setData([]);
			})
			.finally(() => setLoading(false));
	};

	const request = useApi<DataEvents>({
		url: '/api/Eventos',
	});

	function onChange(public_id: string) {
		if (item) {
			const index = data.findIndex((i) => i.id === item.id);
			const images = [
				...data?.slice(0, index),
				{ ...item, public_id },
				...data?.slice(index + 1),
			];
			setData(images);
			onSave(images);
		} else {
			const images = [
				...data,
				{
					id: uuidv4(),
					decrição: '',
					public_id,
				},
			];
			setData(images);
			onSave(images);
		}
		setOpen(false);
		setItem(null);
	}

	function onSave(images: DataImageItem[]) {
		request
			.sendRequest('put', {
				...row,
				imagemEvento: JSON.stringify(images),
			} as DataEvents)
			.then(() => {
				getData();
			});
	}

	const deleteItem = (id: string) => {
		const images = data.filter((i) => i.id !== id);
		onSave(images);
	};

	const onSelection = (item: string) => {
		onChange(item);
		setOpen(false);
	};

	const moveItem = (fromIndex: number, toIndex: number) => {
		setData((prevItems) => {
			const newItems = [...prevItems];
			const [movedItem] = newItems.splice(fromIndex, 1);
			newItems.splice(toIndex, 0, movedItem);
			return newItems;
		});

		setModify(() => {
			const newItems = [...data];
			const [movedItem] = newItems.splice(fromIndex, 1);
			newItems.splice(toIndex, 0, movedItem);
			return newItems;
		});
	};

	useEffect(() => {
		if (modify.length > 0) onSave(modify);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modify]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="animate-spin" size={40} />
			</div>
		);
	}

	return (
		<Pages title={title} breadcrumb={dataBreadcrumb} icon={<Calendar />}>
			{open && (
				<FormData open={open} setOpen={setOpen} onSelection={onSelection} />
			)}
			<div className="mb-2 mt-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar imagem
				</Button>
			</div>
			<div className="pt-3">
				<DndProvider backend={HTML5Backend}>
					{data.map((item, index) => (
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
		</Pages>
	);
}

export default AuthGuard(EventEditImagePage);
