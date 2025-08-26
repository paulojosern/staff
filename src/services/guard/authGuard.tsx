'use client';

import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';
import { authService } from '../../lib/api/auth';
import { useAuth } from '@/providers/useAuth';

import { Loader2 } from 'lucide-react';

export default function AuthGuard<P extends object>(
	WrappedComponent: ComponentType<P>,
	pageIdentifier?: string
) {
	return function ProtectedRoute(props: P) {
		const { user, loading, twoFactorRequired, getRolesByPage } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (pageIdentifier && !getRolesByPage(pageIdentifier)) {
				router.push('/home');
			}

			if (!loading && !authService.isAuthenticated()) {
				router.push(twoFactorRequired ? '/autenticacao' : '/login');
			}
		}, [loading, user, router, twoFactorRequired, getRolesByPage]);

		if (loading || !authService.isAuthenticated()) {
			return (
				<div className="min-h-screen flex items-center justify-center">
					<Loader2 className="animate-spin" size={40} />
				</div>
			);
		}

		return <WrappedComponent {...props} />;
	};
}

// "use client"; // HOCs que usam hooks precisam ser Componentes de Cliente

// import { useRouter } from 'next/navigation';
// import { useState, useEffect, ComponentType } from 'react';
// import LoadingComponent from './LoadingComponent'; // Crie um componente de loading simples

// // A "Factory" que cria o HOC
// export function withAuth<P extends object>(
//   WrappedComponent: ComponentType<P>,
//   pageIdentifier: string // Parâmetro para identificar a página
// ) {
//   const WithAuthComponent = (props: P) => {
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(true);
//     const [isVerified, setIsVerified] = useState(false);

//     useEffect(() => {
//       const checkPermission = async () => {
//         try {
//           // Faz a chamada para a sua API de validação
//           const response = await fetch('/api/validate-permission', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ page: pageIdentifier }), // Envia o identificador
//           });

//           // Se a resposta não for OK ou a permissão for negada, redireciona
//           if (!response.ok) {
//             router.replace('/home');
//             return;
//           }

//           const data = await response.json();

//           if (data.canView) {
//             setIsVerified(true); // Permissão concedida
//           } else {
//             router.replace('/home'); // Redireciona se não tiver permissão
//           }
//         } catch (error) {
//           console.error("Falha na verificação de permissão:", error);
//           router.replace('/home'); // Em caso de erro, redireciona por segurança
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       checkPermission();
//     }, [router]); // Adicionamos `router` às dependências do useEffect

//     // Enquanto verifica, exibe um componente de loading
//     if (isLoading) {
//       return <LoadingComponent />;
//     }

//     // Se verificado com sucesso, renderiza a página solicitada
//     if (isVerified) {
//       return <WrappedComponent {...props} />;
//     }

//     // Caso contrário, não renderiza nada (pois o redirecionamento já foi acionado)
//     return null;
//   };
