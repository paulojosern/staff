'use client';

import { useCorporation } from '@/providers/useCorporation';
import AuthGuard from '@/services/guard/authGuard';
import Base from '@/theme/base';
import Widget from './widget';
import { useAuth } from '@/providers/useAuth';

function HomePage() {
	const { corporation } = useCorporation();
	const { user } = useAuth();

	return (
		<Base>
			<div className="space-y-4 mb-4 md:hidden">
				<p className="font-medium text-lg md:hidden">
					{corporation?.corporacaoNome}
				</p>
			</div>

			<div className="flex flex-col md:flex-row  gap-4 w-full">
				<Widget
					title="Prestadores"
					description="Lista de staff, prestadores e produtores"
					url="/prestadores"
				/>
				<Widget
					title="Alocações"
					description="Lsita de usuários para alocação"
					url={`/alocacoes/${user?.produtorId}`}
				/>
			</div>
		</Base>
	);
}

export default AuthGuard(HomePage);
