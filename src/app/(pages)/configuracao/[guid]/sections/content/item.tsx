import { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { TypeCustomSection } from '../models';
import { Button } from '@/components/ui/button';
import { DataCorporation } from '@/providers/useCorporation';
import { FormData } from './form';
import { useConfirmationDialog } from '@/hooks/use-confirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation';

type PropsSectionItemAttributes = {
	item: TypeCustomSection;
	items: TypeCustomSection[];
	chave: string;
	corporacaoAtributoID?: number;
	corporation: DataCorporation;
	addAttributes: (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number,
		corporacaoID?: number
	) => void;
	index: number;
};

// Formulario alteração e criação
export function SectionItem({
	item,
	items,
	chave,
	corporacaoAtributoID,
	corporation,
	addAttributes,
}: PropsSectionItemAttributes) {
	const [openItem, setOpenItem] = useState(false);
	const confirmationDialog = useConfirmationDialog();

	const onDelete = async () => {
		try {
			await confirmationDialog.openConfirmation({
				title: 'Confirmar',
				message: `Tem certeza que deseja  excluir?`,
				confirmText: `Sim, excluir`,
				cancelText: 'Não, cancelar',
			});

			const rest = items?.filter((i) => i?.titulo != item?.titulo);
			const data = {
				[chave]: rest,
			};

			addAttributes(
				JSON.stringify(data),
				chave,
				corporacaoAtributoID,
				corporation?.corporacaoID
			);
		} catch {
			// This code runs if the user clicks "No"
			console.log('Operação cancelada pelo usuário.');
		}
	};

	const onSave = (item: TypeCustomSection, index = 0) => {
		const data = {
			[chave]: [...items?.slice(0, index), item, ...items?.slice(index + 1)],
		};

		addAttributes(
			JSON.stringify(data),
			chave,
			corporacaoAtributoID,
			corporation?.corporacaoID
		);
	};

	return (
		<div className="border rounded-md p-4 mb-4 md:px-6">
			<ConfirmationDialog hook={confirmationDialog} />
			{openItem && (
				<FormData
					open={openItem}
					setOpen={setOpenItem}
					titulo={item.titulo}
					descricao={item.descricao}
					corporation={corporation}
					onSave={onSave}
					index={items?.findIndex((i) => i?.titulo == item?.titulo)}
				/>
			)}
			<div className="flex justify-between gap-4 mb-2">
				<div className="font-medium">{item.titulo}</div>
				{/* {index > 0 && (
            <LightTooltip title="Colocar em primeiro">
              <IconButton color="primary" onClick={setUp}>
                <FiChevronUp />
              </IconButton>
            </LightTooltip>
          )} */}
				<div className="flex gap-2 items-start">
					<Button variant="secondary" onClick={onDelete}>
						<FiTrash2 />
					</Button>

					<Button variant="secondary" onClick={() => setOpenItem(true)}>
						<FiEdit3 />
					</Button>
				</div>
			</div>
			<div className="content">{ReactHtmlParser(item.descricao)}</div>
		</div>
	);
}
