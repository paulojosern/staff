'use client';

import { useCorporation } from '@/providers/useCorporation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import useApiList from '@/hooks/use-api-list';
import { DataTax } from '../../../models';
import { FormDataTax } from '../form-tax';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	id: number;
}

export function Tax({ open, setOpen, id }: Props) {
	const { corporation } = useCorporation();

	const item = useApiList<DataTax[]>({
		url: `/api/CatalogoProdutoTaxa/List?CatalogoProdutoID=${id}`,
		fetcher: !!corporation,
	});

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-w-[825px] overflow-y-auto max-h-[90dvh]  text-left">
				<DialogHeader className="text-left">
					<DialogTitle> {item.response[0]?.nome || 'Taxa'}</DialogTitle>
					<DialogDescription>
						{item.response[0]?.nome ? 'Editar' : 'Cadastrar'}
					</DialogDescription>
				</DialogHeader>
				{item.response && !item.isLoading ? (
					<FormDataTax item={item.response[0]} setOpen={setOpen} />
				) : (
					<div className="min-h-[200px]flex items-center justify-center">
						<Loader2 className="animate-spin" size={40} />
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
