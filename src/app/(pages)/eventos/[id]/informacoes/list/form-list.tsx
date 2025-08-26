'use client';

import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction, useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DataListItems } from '../page';
import { CirclePlus } from 'lucide-react';

import { v4 as uuidv4 } from 'uuid';
import { FiTrash2 } from 'react-icons/fi';

type PropsForm = {
	setOpen: Dispatch<SetStateAction<boolean>>;
	open: boolean;
	data: DataListItems[] | undefined;
	save: (data: DataListItems[]) => void;
};

const FormList = ({ setOpen, open, data, save }: PropsForm) => {
	const [values, setValues] = useState<DataListItems[] | null>(data ?? []);
	const [value, setValue] = useState<string>('');
	const [item, setItem] = useState<DataListItems | null>();

	const handleChange = (value: string) => {
		setValue(value);
	};

	const addList = () => {
		const item = {
			id: uuidv4(),
			label: value,
			nome: null,
			documento: null,
			pedidoId: null,
		} as DataListItems;

		setValues([...(values as DataListItems[]), item]);
		setValue('');
	};

	const saveItem = (item: DataListItems) => {
		const data = values?.map((i) => {
			if (i.id === item.id) {
				return {
					...i,
					label: value,
				};
			}
			return i;
		}) as DataListItems[];
		setValues(data);
		setValue('');
		setItem(null);
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className=" md:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Lista</DialogTitle>
				</DialogHeader>
				<div className="flex gap-2">
					<Input
						name="item"
						placeholder="Item"
						onChange={(e) => handleChange(e.target.value)}
						value={value}
					/>
					{item ? (
						<div className="flex gap-2 items-center">
							<Button
								variant="outline"
								disabled={value.length < 1}
								onClick={() => {
									setValue('');
									setItem(null);
								}}
							>
								cancelar
							</Button>
							<Button
								variant="default"
								disabled={value.length < 1}
								onClick={() => saveItem(item)}
							>
								Salvar
							</Button>
						</div>
					) : (
						<div>
							<Button
								variant="outline"
								size="icon"
								disabled={value.length < 1}
								onClick={addList}
							>
								<CirclePlus size={20} />
							</Button>
						</div>
					)}
				</div>
				<div className="max-h-[50dvh] overflow-y-auto">
					<div className=" border rounded-md mb-2">
						{values?.map((item) => (
							<div
								className="flex justify-between items-center p-2 px-4 border-b last:border-b-0 text-sm"
								key={item.id}
							>
								{item.label}

								<div className="flex gap-3 items-center">
									<Button
										variant="outline"
										onClick={() => {
											setValue(item.label);
											setItem(item);
										}}
									>
										Editar
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => {
											setValues(values?.filter((i) => i.id !== item.id));
										}}
									>
										<FiTrash2 size={16} />
									</Button>
								</div>
							</div>
						))}
					</div>
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
							save(values as DataListItems[]);
						}}
					>
						Salvar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FormList;
