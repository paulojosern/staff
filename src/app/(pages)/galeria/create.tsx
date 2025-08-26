'use client';
import Upload from '@/components/elements/upload';
import { Button } from '@/components/ui/button';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import useApi from '@/hooks/use-api';
import { useAuth } from '@/providers/useAuth';
import { useState } from 'react';
import { DataGallery } from './models';
import { Loader2 } from 'lucide-react';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setRevalidate: React.Dispatch<React.SetStateAction<boolean>>;
	// onSelection: (item: string) => void;
}

export function FormCreate({ open, setOpen, setRevalidate }: Props) {
	const [save, setSave] = useState(false);
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);

	const request = useApi<DataGallery>({
		url: '/api/Galeria',
	});
	const handleSubmit = async (file: string, name?: string) => {
		await request
			.sendRequest('post', {
				nome: name,
				categoria: 'loja',
				ativo: true,
				public_id: file || '',
				corporacaoID: user?.corporacaoID,
			} as DataGallery)
			.then(() => {
				setOpen(false);
				setSave(false);
				setRevalidate(true);
				setTimeout(() => {
					setRevalidate(false);
				}, 100);
			});
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:min-w-[200] h-[auto]">
				<DialogHeader>
					<DialogTitle>Selecione uma imagem</DialogTitle>
				</DialogHeader>
				<div className="max-h-[80dvh] overflow-y-auto">
					<Upload
						save={save}
						handleSubmit={handleSubmit}
						loading={loading || request.isLoading}
					/>
				</div>
				<div className="flex items-center justify-between mt-2">
					<Button
						variant="outline"
						onClick={() => {
							setOpen(false);
						}}
						disabled={loading || request.isLoading}
					>
						Cancelar
					</Button>

					<Button
						variant="default"
						onClick={() => {
							setLoading(true);
							setSave(true);
						}}
						disabled={loading || request.isLoading}
					>
						{(loading || request.isLoading) && <Loader2 />} Salvar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
