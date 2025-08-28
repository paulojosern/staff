'use client';

import { useCorporation } from '@/providers/useCorporation';
import AuthGuard from '@/services/guard/authGuard';
import Base from '@/theme/base';

import { Calendar } from '@/components/ui/calendar';

function HomePage() {
	// const { getRolesByPage } = useAuth();
	const { corporation } = useCorporation();

	const date = [new Date('2025/05/17'), new Date('2025/05/18')];

	const handleDateChange = (value: Date[] | undefined) => {
		console.log(value);
	};
	console.log(corporation);

	return (
		<Base>
			<div className="space-y-4 mb-4">
				<h1>{corporation?.corporacaoNome}</h1>
			</div>

			<Calendar
				mode="multiple"
				selected={date}
				onSelect={handleDateChange}
				className="rounded-lg border p-8  mb-4  mt-4"
			/>
		</Base>
	);
}

export default AuthGuard(HomePage);
