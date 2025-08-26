'use client';

import { useDrag, useDrop } from 'react-dnd';

import { useRef } from 'react';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Banners } from '.';

interface DraggableItemProps {
	item: Banners;
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
			className="sm:w-[300px] w-full sm:m-2 text-center mb-6 md:mb-0"
		>
			<Image
				loading="lazy"
				src={`https://res.cloudinary.com/ligatechstaff/image/upload/${item.public_id}.avif`}
				alt="imagem evento"
				height={120}
				width={390}
				style={{
					objectFit: 'cover',
					borderRadius: '5px',
					width: '100%',
					height: 'auto',
					border: '1px solid #ccc',
				}}
			/>
			<Button
				variant="secondary"
				size="sm"
				onClick={() => deleteItem(item.id)}
				className="mt-4"
			>
				Remover
			</Button>
		</div>
	);
};

export default DraggableItem;
