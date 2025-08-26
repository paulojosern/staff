import { DataCorporation } from '@/providers/useCorporation';
import ConfigurationPages from './configurations/pages';
// import ConfigurationUsers from './configurations/users';
import ConfigurationPayment from './configurations/payment';
import ConfigurationOrders from './configurations/orders';

interface Props {
	corporation: DataCorporation;
}
export default function Configuration({ corporation }: Props) {
	return (
		<div className="flex flex-col">
			<ConfigurationPages corporation={corporation} />
			{/* <ConfigurationUsers corporation={corporation} /> */}
			<ConfigurationPayment corporation={corporation} />
			<ConfigurationOrders corporation={corporation} />
		</div>
	);
}
