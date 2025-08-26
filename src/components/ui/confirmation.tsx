'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useConfirmationDialog } from '@/hooks/use-confirmation';

interface ConfirmationDialogProps {
	hook: ReturnType<typeof useConfirmationDialog>;
}

export function ConfirmationDialog({ hook }: ConfirmationDialogProps) {
	const { isOpen, title, message, confirmText, cancelText, confirm, cancel } =
		hook;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && cancel()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={cancel}>
						{cancelText}
					</Button>
					<Button onClick={confirm}>{confirmText}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
