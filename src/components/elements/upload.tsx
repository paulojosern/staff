/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { Accept, useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type PropsImgibutes = {
	title?: string;
	save: boolean;
	handleSubmit: (file: string, name?: string) => Promise<void>;
	public_id?: string;
	width?: number;
	height?: number;
	loading: boolean;
};

// Formulario alteração e criação
export default function Upload({
	save,
	handleSubmit,
	width,
	height,
	loading,
}: PropsImgibutes) {
	const [file, setFile] = useState<File[]>([]);
	const [value, setValue] = useState('');
	const [name, setName] = useState<string | undefined>('');
	const [message, setMessage] = useState(null);

	useEffect(() => {
		if (save) {
			onDrop(file);
		}
	}, [save]);

	const acceptedFileTypes: Accept = {
		'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: acceptedFileTypes,
		multiple: false,
		onDrop: (acceptedFiles) => {
			const fileImg = acceptedFiles.find((f) => f);
			const fileName = fileImg?.name;
			const img = new Image();
			img.src = window.URL.createObjectURL(fileImg as Blob);
			img.onload = () => {
				// if (width && height) {
				//   if (img.width !== width && img.height !== height) {
				//     setMessage(
				//       `A imagem ${fileName} tem ${img.width} x ${img.height}. `
				//     )
				//     setValue(null)
				//   }
				// } else {
				setName(fileName);
				setFile(acceptedFiles);
				setValue(img.src);
				setMessage(null);
			};
		},
	});

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

			acceptedFiles.forEach(async (acceptedFile) => {
				const { signature, timestamp } = await getSignature();

				const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_KEY || '';
				const formData = new FormData();
				formData.append('file', acceptedFile);
				formData.append('signature', signature);
				formData.append('timestamp', timestamp);
				formData.append('api_key', api_key);

				const response = await fetch(url, {
					method: 'post',
					body: formData,
				});

				const data = await response.json();
				const public_id_file = data?.public_id;
				if (public_id_file) {
					handleSubmit(public_id_file, name);
				}
				// if (data.error) {

				// }
			});
		},
		[file, name]
	);

	return (
		<div className="relative">
			{loading && (
				<div className="w-full h-full fixed top-0 left-0 flex items-center justify-center bg-white/50">
					<Loader2 />
				</div>
			)}
			{message && (
				<>
					<div>{message}</div>
					<br />
				</>
			)}

			<div>
				<div
					{...getRootProps()}
					className={`dropzone ${isDragActive ? 'active' : null}`}
				>
					<input {...getInputProps()} />
					{value ? (
						<img src={value} alt="none" />
					) : (
						<div className="w-full min-h-[200px] border-dashed border-2 border-gray-400 rounded-lg flex items-center justify-center">
							CLIQUE OU COLE AQUI <br />
							{width && height && `A imagem  tem que ter ${width} x ${height}`}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

async function getSignature() {
	const response = await fetch('/api/sign');
	const data = await response.json();
	const { signature, timestamp } = data;
	return { signature, timestamp };
}
