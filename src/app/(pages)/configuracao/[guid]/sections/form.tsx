import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { TypeSection } from './models';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Props {
	row?: TypeSection;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	corporacaoID?: number;
	corporacaoAtributoID?: number;
	addAttributes: (
		valor: string,
		chave: string,
		corporacaoAtributoID?: number,
		corporacaoID?: number
	) => Promise<void>;
	secoes?: TypeSection[];
}

export function FormSection({
	row,
	open,
	setOpen,
	corporacaoID,
	corporacaoAtributoID,
	addAttributes,
	secoes,
}: Props) {
	const [value, setValue] = useState<TypeSection | undefined>(row);
	const [active, setActive] = useState(row?.ativo);
	const [menu, setMenu] = useState(row?.menu);

	const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValue(
			(prevValues) =>
				({
					...prevValues,
					[name]: value,
				} as TypeSection)
		);
	};

	const onSave = () => {
		if (secoes) {
			if (row) {
				const index = secoes.findIndex(
					(i) => i?.nome_secao === row?.nome_secao
				) as number;

				const data = [
					...secoes?.slice(0, index),
					{
						...value,
						menu,
						ativo: row ? active : false,
					},
					...secoes?.slice(index + 1),
				];

				addAttributes(
					JSON.stringify({ secoes: data }),
					'secoes',
					corporacaoAtributoID,
					corporacaoID
				).then(() => setOpen(false));
			} else {
				const data = [
					...secoes,
					{
						...value,
						menu,
						ativo: true,
					},
				];
				addAttributes(
					JSON.stringify({ secoes: data }),
					'secoes',
					corporacaoAtributoID,
					corporacaoID
				).then(() => setOpen(false));
			}
		} else {
			const data = JSON.stringify({
				secoes: [
					{
						...value,
						menu,
						ativo: true,
					},
				],
			});

			addAttributes(data, 'secoes', corporacaoAtributoID, corporacaoID).then(
				() => setOpen(false)
			);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Seção</DialogTitle>
					<DialogDescription>{row ? 'Editar' : 'Adicionar'}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Input
						name="nome_secao"
						placeholder="Nome da seção"
						id="nome_secao"
						defaultValue={value?.nome_secao}
						onInput={handelChange}
					/>
					{/* <Input
						name="en"
						id="en"
							placeholder="Nome da seção"
						defaultValue={value?.en}
						onInput={handelChange}
					/> */}
					<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
						<div>
							<div className="text-base font-medium">Menu</div>
							<p className="text-sm text-muted-foreground  ">
								Adiciona a seção no menu principal
							</p>
						</div>
						<Switch
							name="menu"
							defaultChecked={menu}
							onCheckedChange={() => setMenu(!menu)}
						/>
					</div>
					{row && (
						<div className="p-3  px-4 border rounded-md space-y-0.5 flex items-start justify-between">
							<div>
								<div className="text-base font-medium">Ativo</div>
								<p className="text-sm text-muted-foreground  ">
									Ativar seção, tornar visivel.
								</p>
							</div>
							<Switch
								name="ativo"
								defaultChecked={active}
								onCheckedChange={() => setActive(!active)}
							/>
						</div>
					)}

					<div className="flex gap-4 pay-2  justify-between">
						<Button variant="secondary" onClick={() => setOpen(false)}>
							Cancelar
						</Button>
						<Button variant="default" onClick={onSave}>
							Salvar
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
