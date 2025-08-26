import { Button } from '@/components/ui/button';
import useApiList from '@/hooks/use-api-list';
import { useCorporation } from '@/providers/useCorporation';
import { Check, ChevronsUpDown, CirclePlus, CircleX } from 'lucide-react';
import { ObjectGeneric } from './models';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
	tagsEvento: string;
	setTagsEvento: React.Dispatch<React.SetStateAction<string>>;
}

export function Tags({ tagsEvento, setTagsEvento }: Props) {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);
	const tags = useApiList<{ valor: string }>({
		url: `/api/sales/Atributo/GetAtributo?CorporacaoGuid=${corporation?.corporacaoGuid}&Chave=tags`,
		fetcher: !!corporation,
	});

	const [values, setValues] = useState('');

	const handleDelete = async (key: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [key]: removedProperty, ...rest } = JSON.parse(tagsEvento);
		setTagsEvento(JSON.stringify(rest));
	};

	return (
		<div className="rounded-lg border p-4">
			{tags.response?.valor && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-[200px] justify-between"
						>
							<CirclePlus />
							Adicionar TAG
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput placeholder="Search framework..." />
							<CommandList>
								<CommandEmpty>No framework found.</CommandEmpty>
								<CommandGroup>
									{Object.entries(JSON.parse(tags.response?.valor || '')).map(
										([key, value]) => (
											<CommandItem
												key={key}
												value={key}
												onSelect={(currentValue) => {
													setValues(currentValue);

													const t = JSON.parse(
														tagsEvento || ''
													) as ObjectGeneric;

													const data = JSON.stringify({ ...t, [key]: value });
													setTagsEvento(data);
													setOpen(false);
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														key === values ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{value as string}
											</CommandItem>
										)
									)}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			)}

			{tagsEvento &&
				Object.entries(JSON.parse(tagsEvento || ''))?.length > 0 && (
					<ul className="flex gap-2 align-center flex-wrap mt-4">
						{Object.entries(JSON.parse(tagsEvento || '') as ObjectGeneric)?.map(
							([key, value]) => (
								<li
									className="rounded-xl px-2 py-1.5 border text-sm flex items-center gap-2"
									key={key}
								>
									{value}
									<CircleX
										size={16}
										className="cursor-pointer"
										onClick={() => handleDelete(key)}
									/>
								</li>
							)
						)}
					</ul>
				)}
		</div>
	);
}
