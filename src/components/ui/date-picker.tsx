'use client';

import { useState } from 'react';

import { format } from 'date-fns-tz';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface DateTimePickerProps {
	value?: string;
	onChange?: (date: string | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
}

export function DatePicker({
	value,
	onChange,
	placeholder = 'Selecione uma data',
	disabled = false,
	error,
}: DateTimePickerProps) {
	const [open, setOpen] = useState(false);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		onChange?.(selectedDate?.toISOString() as string);
	};

	const formatDisplayValue = (date: Date) => {
		return format(date, 'dd/MM/yyyy');
	};

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							'w-full justify-start text-left font-normal',
							!value && 'text-muted-foreground',
							error && 'border-red-500'
						)}
						disabled={disabled}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value ? formatDisplayValue(new Date(value)) : placeholder}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<div className="p-3 space-y-3">
						<Calendar
							mode="single"
							selected={value ? new Date(value) : undefined}
							onSelect={handleDateSelect}
							initialFocus
						/>
					</div>
				</PopoverContent>
			</Popover>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}
