import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { DataGallery } from './models';
import Image from 'next/image';
import useApi from '@/hooks/use-api';
import { Loader2, Trash } from 'lucide-react';
import { useState } from 'react';

interface Props {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item?: DataGallery;
	revalidate: () => void;
}

export function FormData({ open, setOpen, item, revalidate }: Props) {
	const [loading, setLoading] = useState(false);
	const request = useApi<DataGallery>({
		url: '/api/Galeria',
	});

	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/delete-image?name=${encodeURIComponent(item?.public_id || '')}`,
				{
					method: 'DELETE',
				}
			);

			if (!response.ok) {
				throw new Error('Failed to delete image');
			}
			const data = await response.json();
			if (data) {
				request
					.sendRequest(
						'delete',
						{} as DataGallery,
						`?Galeriaid=${item?.galeriaID}`
					)
					.then(() => {
						revalidate();
						setOpen(false);
						setLoading(false);
					});
			}
		} catch {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogContent className="sm:max-h-[90dvw]">
				<DialogHeader>
					<DialogTitle>Imagem {item?.public_id}</DialogTitle>
					<DialogDescription>{item ? 'Editar' : 'Cadastrar'}</DialogDescription>
				</DialogHeader>
				<Image
					loading="lazy"
					src={`https://res.cloudinary.com/ligatechstaff/image/upload/${item?.public_id}.avif`}
					alt="imagem evento"
					height={300}
					width={300}
					sizes="100vw"
					style={{
						objectFit: 'contain',
						width: '100%',
					}}
				/>
				<div className="flex justify-between">
					<Button
						onClick={() => setOpen(false)}
						variant="secondary"
						disabled={loading || request.isLoading}
					>
						Cancelar
					</Button>
					<Button onClick={onDelete} disabled={loading || request.isLoading}>
						{loading || request.isLoading ? <Loader2 /> : <Trash />}
						Remover
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
