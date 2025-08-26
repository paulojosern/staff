import { RichTextEditor } from '@/components/elements/RichTextEditor';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { DataCorporation } from '@/providers/useCorporation';
import { TypeCustomSection } from '../models';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	titulo: string;
	descricao: string;
	corporation: DataCorporation;
	index?: number;
	onSave: (item: TypeCustomSection, index?: number) => void;
}

export function FormData({
	open,
	setOpen,
	titulo,
	descricao,
	corporation,
	onSave,
	index,
}: Props) {
	const [value, setValue] = useState<TypeCustomSection>({
		titulo,
		descricao,
	});

	const onChange = (descricao: string) => {
		setValue({
			...value,
			descricao,
		});
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="md:max-w-[90dvw]">
				<DialogHeader>
					<DialogTitle>
						{value.titulo ? 'Editar conteúdo' : 'Adicionar novo conteúdo'}
					</DialogTitle>
					<div>
						<label className="text-sm font-medium">Titulo</label>
						<Input
							value={value.titulo}
							onChange={(e) => setValue({ ...value, titulo: e.target.value })}
						/>
					</div>
				</DialogHeader>
				<div className="h-[70dvh] overflow-y-auto">
					<RichTextEditor
						content={value?.descricao || ''}
						onChange={onChange}
						placeholder="Digite seu texto aqui..."
						primary={corporation?.corPrimaria || ''}
						secondary={corporation?.corSecundaria || ''}
					/>
				</div>
				<div className="flex justify-between gap-2">
					<Button onClick={() => setOpen(false)}>Fechar</Button>
					<Button
						onClick={() => {
							onSave(value, index);
							setOpen(false);
						}}
					>
						Salvar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
