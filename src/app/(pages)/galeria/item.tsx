import Image from 'next/image';
import { DataGallery } from './models';

interface Props {
	item: DataGallery;
	onSelectedItem: (item: DataGallery) => void;
	selection: DataGallery | null | undefined;
}
export default function GalleryItem({
	item,
	onSelectedItem,
	selection,
}: Props) {
	return (
		<div
			className={
				selection?.galeriaID === item.galeriaID
					? 'overflow-hidden mb-4 border-2 border-primary p-2'
					: 'overflow-hidden mb-4 p-2'
			}
			onClick={() => {
				onSelectedItem(item);
			}}
		>
			<Image
				loading="lazy"
				src={`https://res.cloudinary.com/ligatechstaff/image/upload/${item?.public_id}.avif`}
				alt="imagem evento"
				height={100}
				width={100}
				sizes="100vw"
				style={{
					width: '100%',
					height: 'auto',
					borderRadius: '5px',
				}}
			/>
		</div>
	);
}
