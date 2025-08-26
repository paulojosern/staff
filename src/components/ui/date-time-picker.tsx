'use client';

import { useState } from 'react';

import { format } from 'date-fns-tz';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export function DateTimePicker({
	value,
	onChange,
	placeholder = 'Select date and time',
	disabled = false,
	error,
}: DateTimePickerProps) {
	const [open, setOpen] = useState(false);
	const [timeValue, setTimeValue] = useState(
		value ? format(value, 'HH:mm') : '00:00'
	);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			const [hours, minutes] = timeValue.split(':').map(Number);
			const newDate = new Date(selectedDate);
			newDate.setHours(hours, minutes, 0, 0);

			onChange?.(newDate?.toISOString());
		} else {
			onChange?.(undefined);
		}
	};

	const handleTimeChange = (time: string) => {
		setTimeValue(time);
		if (value) {
			const [hours, minutes] = time.split(':').map(Number);
			const newDate = new Date(value);
			newDate.setHours(hours, minutes, 0, 0);

			const dataLocalStr =
				newDate.toISOString().split('T')[0] +
				'T' +
				newDate.toLocaleTimeString('pt-BR');

			onChange?.(dataLocalStr);
		}
	};

	const formatDisplayValue = (date: Date) => {
		return format(date, 'dd/MM/yyyy HH:mm');
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
						<div className="flex items-center space-x-2 px-3">
							<Clock className="h-4 w-4" />
							<Label htmlFor="time" className="text-sm">
								Time:
							</Label>
							<Input
								id="time"
								type="time"
								value={timeValue}
								onChange={(e) => handleTimeChange(e.target.value)}
								className="w-auto"
							/>
						</div>
						<div className="flex justify-end px-3">
							<Button size="sm" onClick={() => setOpen(false)}>
								Done
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}
