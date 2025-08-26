'use client';

import { useDrag, useDrop } from 'react-dnd';

import { useRef } from 'react';
import { Edit, GripVertical, Trash2 } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DataInformationItem } from '../../models';

interface DraggableItemProps {
	item: DataInformationItem;
	index: number;
	moveItem: (fromIndex: number, toIndex: number) => void;
	setFormEdit: (item: DataInformationItem) => void;
	removeForm: (index: number) => void;
	setOpen: (open: boolean) => void;
}

const DraggableItem = ({
	item,
	index,
	moveItem,
	setFormEdit,
	setOpen,
	removeForm,
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
			className="w-full"
		>
			<article
				key={`${item.id}-${index}`}
				className="flex justify-between gap-2 p-2 items-center border rounded-md mb-2"
			>
				<div className="flex justify-between gap-2">
					<GripVertical />
					{item.name}
				</div>
				<div className="flex justify-between gap-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => {
										setFormEdit(item);
										setOpen(true);
									}}
								>
									<Edit />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Editar</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => removeForm(item.id)}
								>
									<Trash2 />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Editar</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</article>
		</div>
	);
};

export default DraggableItem;
