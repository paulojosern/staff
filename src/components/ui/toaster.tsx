import { toast } from 'sonner';
import { X } from 'lucide-react';
interface PropsToaster {
	t: string | number;
	type?: 'success' | 'info' | 'error' | 'warning';
	description: string;
}
function Toaster({ t, type = 'info', description }: PropsToaster) {
	if (type === 'success') {
		return (
			<div className="w-[300px] bg-blue-500 rounded-lg py-4 px-6 text-white relative">
				<div>{description}</div>
				<button
					className="absolute top-2 right-2 "
					onClick={() => toast.dismiss(t)}
				>
					<X size={18} />
				</button>
			</div>
		);
	}

	if (type === 'error') {
		return (
			<div className="w-[300px] bg-red-500 rounded-lg py-4 px-6 text-white relative">
				<div>{description}</div>
				<button
					className="absolute top-2 right-2 "
					onClick={() => toast.dismiss(t)}
				>
					<X size={18} />
				</button>
			</div>
		);
	}

	if (type === 'warning') {
		return (
			<div className="w-[300px] bg-yellow-500 rounded-lg py-4 px-6 text-black relative">
				<div>{description}</div>
				<button
					className="absolute top-2 right-2 "
					onClick={() => toast.dismiss(t)}
				>
					<X size={18} />
				</button>
			</div>
		);
	}
	return (
		<div className="w-[300px] bg-blue-500 rounded-lg py-4 px-6 text-white relative">
			<div>{description}</div>
			<button
				className="absolute top-2 right-2 "
				onClick={() => toast.dismiss(t)}
			>
				<X size={18} />
			</button>
		</div>
	);
}

export { Toaster };
