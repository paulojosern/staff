'use client';

import { useDrag, useDrop } from 'react-dnd';

import { useRef } from 'react';
import { DataImageItem } from './page';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface DraggableItemProps {
	item: DataImageItem;
	index: number;
	moveItem: (fromIndex: number, toIndex: number) => void;
	deleteItem: (id: string) => void;
}

const DraggableItem = ({
	item,
	index,
	moveItem,
	deleteItem,
}: DraggableItemProps) => {
	const ref = useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag] = useDrag({
		type: 'ITEM',
		item: { index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const [, drop] = useDrop({
		accept: 'ITEM',
		hover: (draggedItem: { index: number }) => {
			if (draggedItem.index !== index) {
				moveItem(draggedItem.index, index);
				draggedItem.index = index;
			}
		},
	});

	drag(drop(ref));

	return (
		<div
			ref={ref}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: 'move',
				display: 'inline-block',
			}}
			className="sm:w-[300px] w-full sm:m-2 text-center"
		>
			<Image
				loading="lazy"
				src={`https://res.cloudinary.com/ligatechstaff/image/upload/${item.public_id}.avif`}
				alt="imagem evento"
				height={100}
				width={100}
				sizes="100vw"
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					borderRadius: '15px',
				}}
			/>
			<Button
				variant="destructive"
				onClick={() => deleteItem(item.id)}
				className="mt-4"
			>
				Remover
			</Button>
		</div>
	);
};

export default DraggableItem;
