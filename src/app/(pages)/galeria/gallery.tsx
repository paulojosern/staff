import useApiList from '@/hooks/use-api-list';
import { useCorporation } from '@/providers/useCorporation';

import { DataGallery } from './models';
import GalleryItem from './item';
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
const FormData = dynamic(() => import('./form').then((mod) => mod.FormData), {
	// loading: () => <p>Carregando...</p>,
	ssr: false,
});

import './style.css';
interface Props {
	onSelection: (item: string) => void;
	defaultOpen?: boolean;
	revalidate?: boolean;
}

export default function Gallery({
	onSelection,
	defaultOpen,
	revalidate = false,
}: Props) {
	const { corporation } = useCorporation();
	const [open, setOpen] = useState(false);
	const [selection, setSelection] = useState<DataGallery>();

	const data = useApiList<DataGallery[]>({
		url: `api/Galeria/List?CorporacaoGuid=${corporation?.corporacaoGuid}`,
		fetcher: !!corporation,
	});

	useEffect(() => {
		if (revalidate) {
			data.revalidate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [revalidate]);

	const onSelectedItem = (item: DataGallery) => {
		setSelection(item);
		setOpen(true);
		onSelection(item.public_id || '');
	};

	return (
		<>
			{open && defaultOpen && (
				<FormData
					open={open}
					setOpen={setOpen}
					item={selection}
					revalidate={data.revalidate}
				/>
			)}
			<div className="wrapper">
				{data?.response?.length > 0 &&
					data.response
						.filter((item) => item.public_id)
						.map((item) => (
							<GalleryItem
								key={item.galeriaID}
								item={item}
								onSelectedItem={onSelectedItem}
								selection={selection}
							/>
						))}
			</div>
		</>
	);
}
