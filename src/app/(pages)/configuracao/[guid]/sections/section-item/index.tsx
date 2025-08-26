'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { TypeSection } from '../models';
import { Button } from '@/components/ui/button';
import { FormSection } from '../form';
import { ConfirmationDialog } from '@/components/ui/confirmation';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { useAttribute } from '@/hooks/use-attribute';

import './style.scss';

type PropsItemAttributes = {
	item: TypeSection;
	index: number;
	open?: boolean;
	setOpen?: Dispatch<SetStateAction<boolean>>;
	setEdit: Dispatch<SetStateAction<string>>;
	corporacaoID?: number;
	cAtributoID?: number;
	addAttributes: (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number,
		corporacaoID?: number
	) => Promise<void>;
	secoes?: TypeSection[];
	guid: string;
	moveItem: (fromIndex: number, toIndex: number) => void;
};

// Formulario alteração e criação
const SectionsItem = ({
	item,
	index,
	moveItem,
	corporacaoID,
	guid,
	addAttributes,
	secoes,
	cAtributoID,
	setEdit,
}: PropsItemAttributes) => {
	const [open, setOpen] = useState(false);

	const chaveReplace = item.nome_secao
		.toLowerCase()
		.replace(/ /g, '')
		.replace(/[^\w-]+/g, '');

	const { corporacaoAtributoID, remove } = useAttribute(guid, chaveReplace);

	const confirmationDialog = useConfirmationDialog();

	const onDelete = async (nome_secao: string, corporacaoAtributoID: number) => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  excluir?`,
				confirmText: `Sim, excluir`,
				cancelText: 'Não, cancelar',
			});
			if (corporacaoAtributoID) {
				await remove(corporacaoAtributoID);
			}

			const rest = secoes?.filter(
				(i) => i?.nome_secao !== nome_secao
			) as TypeSection[];
			await addAttributes(
				JSON.stringify({ secoes: rest }),
				'secoes',
				cAtributoID,
				corporacaoID
			);
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

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

	const propsForm = {
		open,
		setOpen,
		corporacaoID,
		corporacaoAtributoID: cAtributoID,
		addAttributes,
		secoes,
	};

	return (
		<div
			ref={ref}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: 'move',
				display: 'inline-block',
			}}
			className="border-b-1 w-full p-2 flex justify-between [&>*:last-child]:border-0 item"
		>
			<ConfirmationDialog hook={confirmationDialog} />
			<div className=" w-full p-2 flex justify-between">
				<div className="flex gap-2 items-center">{item?.nome_secao}</div>
				<div className="flex gap-2 items-center">
					<Button
						variant="secondary"
						onClick={() => {
							setOpen(true);
						}}
					>
						<FiEdit3 />
					</Button>

					<Button
						variant="secondary"
						onClick={() => onDelete(item.nome_secao, corporacaoAtributoID)}
					>
						<FiTrash2 />
					</Button>

					<Button variant="secondary" onClick={() => setEdit(chaveReplace)}>
						Abrir
					</Button>
				</div>
			</div>
			{open && <FormSection row={item} {...propsForm} />}
		</div>
	);
};

export default SectionsItem;
