import Gallery from '@/app/(pages)/galeria/gallery';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSelection: (item: string) => void;
}

export function GallerySelected({ open, setOpen, onSelection }: Props) {
	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[90dvw]">
				<DialogHeader>
					<DialogTitle>Galeria de imagens</DialogTitle>
					<DialogDescription>Selecione uma imagem</DialogDescription>
				</DialogHeader>
				<div className="h-[80dvh] overflow-y-auto">
					<Gallery onSelection={onSelection} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
