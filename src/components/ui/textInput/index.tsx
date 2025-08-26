'use client';

import type React from 'react';
import { forwardRef, useState } from 'react';
// Helper function to conditionally join classNames
const classNames = (...classes: unknown[]) => {
	return classes.filter(Boolean).join(' ');
};

export interface TextInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	helperText?: string;
	error?: string;
	fullWidth?: boolean;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			className,
			label,
			helperText,
			error,
			fullWidth = false,
			startIcon,
			endIcon,
			disabled,
			required,
			id,
			...props
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const inputId = id;

		return (
			<div
				className={classNames('flex flex-col gap-1.5', fullWidth && 'w-full')}
			>
				{label && (
					<label
						htmlFor={inputId}
						className={classNames(
							'text-sm font-medium',
							disabled ? 'text-gray-400' : 'text-gray-700',
							error && 'text-red-500'
						)}
					>
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
				)}
				<div
					className={classNames(
						'relative flex items-center rounded-md border bg-black',
						isFocused &&
							!disabled &&
							!error &&
							'ring-2 ring-offset-1 ring-blue-300 border-blue-400',
						error && 'border-red-500 ring-1 ring-red-500',
						disabled && 'bg-gray-100 opacity-75',
						fullWidth && 'w-full'
					)}
				>
					{startIcon && (
						<div className="absolute left-3 text-gray-500">{startIcon}</div>
					)}
					<input
						id={inputId}
						ref={ref}
						disabled={disabled}
						required={required}
						className={classNames(
							'w-full rounded-md px-3 py-2 text-base outline-none',
							'placeholder:text-gray-400',
							startIcon && 'pl-9',
							endIcon && 'pr-9',
							disabled && 'cursor-not-allowed bg-gray-100 text-gray-500',
							className
						)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						aria-invalid={!!error}
						aria-describedby={
							error
								? `${inputId}-error`
								: helperText
								? `${inputId}-helper`
								: undefined
						}
						{...props}
					/>
					{endIcon && (
						<div className="absolute right-3 text-gray-500">{endIcon}</div>
					)}
				</div>
				{error && (
					<p id={`${inputId}-error`} className="text-xs text-red-500">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p id={`${inputId}-helper`} className="text-xs text-gray-500">
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

TextInput.displayName = 'TextInput';

export { TextInput };
