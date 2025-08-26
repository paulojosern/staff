import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<'input'>
>(({ className, type, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className="relative">
			<input
				ref={ref}
				type={showPassword ? 'text' : 'password'}
				data-slot="input"
				className={cn(
					'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
					'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
					'pr-9', // Adiciona padding para o ícone
					className
				)}
				{...props}
			/>
			{type === 'password' && (
				<button
					type="button"
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					onClick={() => setShowPassword(!showPassword)}
					aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
				>
					{showPassword ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</button>
			)}
		</div>
	);
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
