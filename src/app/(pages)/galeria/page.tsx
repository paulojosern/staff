'use client';

import AuthGuard from '@/services/guard/authGuard';
import Pages from '@/theme/pages';
import { useState } from 'react';
import { Image as IMG } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

import Gallery from './gallery';

import dynamic from 'next/dynamic';

const FormCreate = dynamic(
	() => import('./create').then((mod) => mod.FormCreate),
	{
		// loading: () => <p>Carregando...</p>,
		ssr: false,
	}
);

const dataBreadcrumb = [
	{
		title: 'Home',
		url: '/home',
	},
];
function GalleryPage() {
	const [open, setOpen] = useState(false);
	const [revalidate, setRevalidate] = useState(false);

	return (
		<Pages
			title="Galeria de imagens"
			breadcrumb={dataBreadcrumb}
			icon={<IMG />}
		>
			{open && (
				<FormCreate
					open={open}
					setOpen={setOpen}
					setRevalidate={setRevalidate}
				/>
			)}
			<div className="mb-2 mt-2">
				<Button
					variant="default"
					onClick={() => setOpen(true)}
					className="max-sm:my-2"
				>
					<CirclePlus />
					Adicionar imagem
				</Button>
			</div>
			<Gallery onSelection={() => {}} revalidate={revalidate} defaultOpen />
		</Pages>
	);
}

export default AuthGuard(GalleryPage);
