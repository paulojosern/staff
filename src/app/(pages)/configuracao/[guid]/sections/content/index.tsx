import { Dispatch, SetStateAction, useState } from 'react';

import { FiChevronLeft, FiPlus } from 'react-icons/fi';
import { TypeCustomSection } from '../models';
import { Button } from '@/components/ui/button';
import { SectionItem } from './item';
import { DataCorporation } from '@/providers/useCorporation';
import { useAttribute } from '@/hooks/use-attribute';
import { FormData } from './form';

type PropsSectionAttributes = {
	guid: string;
	edit: string;
	corporation: DataCorporation;
	setEdit: Dispatch<SetStateAction<string>>;
};

// Formulario alteração e criação
export function Section({
	guid,
	edit,
	corporation,
	setEdit,
}: PropsSectionAttributes) {
	// const [corporacaoAtributoID, setCorporacaoAtributoID] = useState<number>(0);

	const { attribute, corporacaoAtributoID, addAttributes } = useAttribute<{
		[key: string]: TypeCustomSection[];
	}>(guid, edit);

	const [openItem, setOpenItem] = useState(false);

	const onSave = async (item: TypeCustomSection) => {
		const data = {
			[edit]: [...(attribute?.[edit] || []), item],
		};
		await addAttributes(
			JSON.stringify(data),
			edit,
			corporacaoAtributoID,
			corporation?.corporacaoID
		);
	};

	return (
		<div>
			{openItem && (
				<FormData
					open={openItem}
					setOpen={setOpenItem}
					titulo={''}
					descricao={''}
					corporation={corporation}
					onSave={onSave}
				/>
			)}
			<div className="flex justify-between items-center mb-4">
				<Button onClick={() => setEdit('')} color="primary">
					<FiChevronLeft /> Voltar
				</Button>
				<Button onClick={() => setOpenItem(true)} color="primary">
					Adicionar item <FiPlus />
				</Button>
				{/* <FormItem row={null} {...propsFormItem} /> */}
			</div>
			<div>
				{attribute?.[edit]?.map((row, i) => (
					<SectionItem
						key={i}
						item={row}
						items={attribute?.[edit]}
						chave={edit}
						corporacaoAtributoID={corporacaoAtributoID}
						corporation={corporation}
						addAttributes={addAttributes}
						index={i}
					/>
				))}
			</div>
			{!attribute?.[edit]?.length && (
				<div className="p-4">Nenhum item cadastrado</div>
			)}
		</div>
	);
}
