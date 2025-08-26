'use client';

import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import { DataInformationItem } from '../../models';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CirclePlus, X } from 'lucide-react';

type PropsForm = {
	setOpen: Dispatch<SetStateAction<boolean>>;
	open: boolean;
	item?: DataInformationItem | null;
	setFormItem: Dispatch<SetStateAction<DataInformationItem | null>>;
};

const FormItem = ({ item, setOpen, open, setFormItem }: PropsForm) => {
	const [state, setState] = useState<DataInformationItem>(
		item as DataInformationItem
	);

	const handleChange = (name: string, e: string | number | boolean) => {
		const id = +(Math.random() * 2000).toString();

		const i = {
			...state,
			id: state?.id || id,
			[name]: e,
		} as DataInformationItem;
		setState(i);
	};

	const setSave = () => {
		setFormItem(state);
		setOpen(false);
	};

	const [option, setOption] = useState('');

	const addOption = (label: string) => {
		const item = {
			id: state.option ? state.option.length + 1 : 1,
			label,
		};
		const data = {
			...state,
			option: state?.option ? [...state?.option, item] : [item],
		};
		setState(data);

		setOption('');

		console.log(data);
	};

	const removeOption = (id: number) => {
		if (state.option) {
			const option = state.option.filter((i) => i.id !== id);
			const data = {
				...state,
				option,
			};
			setState(data);
		}
	};

	const valid = () => {
		if (state?.name) {
			if (state?.type === 'select') {
				if (state?.externalList) {
					return false;
				}
				if (!state?.option || state?.option?.length === 0) {
					return true;
				}
				return true;
			} else if (!state?.type) {
				return true;
			} else {
				return false;
			}
		}

		return true;
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-h-[90dvw]">
				<DialogHeader>
					<DialogTitle>{item ? 'Editar' : 'Cadastrar'}</DialogTitle>
				</DialogHeader>

				<Input
					name="name"
					placeholder="Titulo"
					onChange={(e) => handleChange('name', e.target.value)}
					defaultValue={state?.name}
				/>

				<Select
					onValueChange={(e) => handleChange('type', e)}
					defaultValue={state?.type}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Selecione" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Tipo</SelectLabel>

							<SelectItem value="text">Texto</SelectItem>
							<SelectItem value="date">Data</SelectItem>
							<SelectItem value="tel">Telefone</SelectItem>
							<SelectItem value="email">E-mail</SelectItem>
							<SelectItem value="select">Seleção</SelectItem>
							<SelectItem value="cpf">CPF</SelectItem>
							<SelectItem value="upload">Upload</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				{state?.type === 'select' && (
					<>
						<div className="text-xs flex gap-2">
							<Switch
								name="externalList"
								onCheckedChange={(e) => handleChange('externalList', e)}
								checked={state?.externalList}
								// onChange={e => activeItem(e.target.checked, item)}
							/>
							Lista externa
						</div>
						{!state?.externalList && (
							<>
								<div className="grid grid-cols-[1fr_auto] items-center gap-4">
									<Input
										name="option"
										placeholder="Adicionar opção"
										value={option}
										onChange={(e) => setOption(e.target.value)}
									/>
									<a color="primary" onClick={() => addOption(option)}>
										<CirclePlus />
									</a>
								</div>
								<div className="flex gap-2">
									{state?.option?.map((op) => (
										<label
											key={op.id}
											className="w-auto flex items-center border px-2.5 py-1.5 rounded-xl gap-1 text-sm"
										>
											<span>{op.label}</span>
											<a onClick={() => removeOption(op.id)}>
												<X size={14} />
											</a>
										</label>
									))}
								</div>
							</>
						)}
					</>
				)}

				<div className="text-xs flex gap-2">
					<Switch
						name="required"
						onCheckedChange={(e) => handleChange('required', e)}
						checked={state?.required}
					/>
					Obrigatório
				</div>
				<div className="text-xs flex gap-2">
					<Switch
						name="nomeBeneficiario"
						onCheckedChange={(e) => handleChange('nomeBeneficiario', e)}
						checked={state?.nomeBeneficiario}
						// onChange={e => activeItem(e.target.checked, item)}
					/>
					Nome benefíciario
				</div>
				<div className="text-xs flex gap-2">
					<Switch
						name="cpfBeneficiario"
						onCheckedChange={(e) => handleChange('cpfBeneficiario', e)}
						checked={state?.cpfBeneficiario}
						// onChange={e => activeItem(e.target.checked, item)}
					/>
					CPF benefíciario
				</div>
				<div className="flex gap-2 justify-between">
					<Button
						variant="outline"
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancelar
					</Button>

					<Button
						variant="default"
						onClick={() => {
							setSave();
						}}
						disabled={valid()}
					>
						Salvar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FormItem;
