'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
import { DataCorporation } from '@/providers/useCorporation';

export type DataOptions = DataCorporation & {
	value: string;
	label: string;
};
interface AutocompleteProps {
	options: { value: string; label: string }[];
	placeholder?: string;
	emptyMessage?: string;
	name?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	formId?: string;
}

export function Autocomplete({
	options,
	placeholder = 'Search...',
	emptyMessage = 'No results found.',
	name,
	value,
	onChange,
	className,
	formId,
}: AutocompleteProps) {
	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(value || '');

	// Handle controlled component if onChange is provided
	const handleSelect = React.useCallback(
		(currentValue: DataOptions) => {
			setSelectedValue(currentValue.value);
			setOpen(false);
			if (onChange) {
				onChange(currentValue.value);
			}
		},
		[onChange]
	);

	// Find the label for the current value
	const selectedLabel = React.useMemo(() => {
		const selected = options.find((option) => option.value === selectedValue);
		return selected?.label || '';
	}, [selectedValue, options]);

	return (
		<div className={cn('relative w-full', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						onClick={() => setOpen(!open)}
					>
						{selectedValue ? selectedLabel : placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command className="rounded-lg border shadow-md md:min-w-[450px]">
						<CommandInput placeholder={placeholder} className="h-9" />
						<CommandList>
							<CommandEmpty>{emptyMessage}</CommandEmpty>
							<CommandGroup heading="Suggestions">
								{options.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => handleSelect(option as DataOptions)}
									>
										<span> {option.label}</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{/* Hidden input for form submission */}
			{name && (
				<input type="hidden" name={name} value={selectedValue} form={formId} />
			)}
		</div>
	);
}
