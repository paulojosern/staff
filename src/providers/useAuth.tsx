'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useEffect,
	useState,
} from 'react';
import { authService } from '../lib/api/auth';
import { usePathname, useRouter } from 'next/navigation';
import { getUserRoles } from '@/lib/api/actions/roles';
// import api from '@/lib/api/axios';

export interface User {
	accessToken: string;
	login?: string;
	categoriaID?: number;
	autenticado: boolean;
	corporacaoID: number;
	created: string;
	documento: string;
	email: string;
	expiration: string;
	nome: string;
	pessoaID: number;
	sobrenome: string;
	tipoDocumento: string;
	tipousuario: string;
	usuarioID: number;
	guid: string;
	refreshToken: string;
	refreshExpiration: string;
	operadorID?: number;
	cadastroEmail?: boolean;
	twoFactorTypeList?: DatatwoFactorTypeList[];
	twoFactorUserRegistered?: DatatwoFactorTypeList[];
	twoFactorRequired?: boolean;
	twoFactorRegistered?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	usuarioPerfil?: any[];

	usuarioCategoriaID: number;
	tipousuarioStaff: string;
	prestadorId: string;
	produtorId: string;
}

export interface DatatwoFactorTypeList {
	tokenApplication: boolean;
	sms: boolean;
	email: boolean;
}

interface Roles {
	[key: string]: RolesPage;
}

interface RolesPage {
	perfilTelaID: number;
	telaID: number;
	codigoTela: string;
	funcionalidades: string[];
}

type AuthContextType = {
	user: User | null;
	getRolesByPage: (page: string) => string[] | undefined;
	loading: boolean;
	signIn: (email: string, password: string, guid: string) => Promise<void>;
	signInMFA: (login: string, code: string, guid: string) => Promise<void>;
	logout: () => void;
	twoFactorRequired: boolean;
	twoFactorRegistered: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [roles, setRoles] = useState<Roles | null>(null);
	const [twoFactorRequired, setTwoFactorRequired] = useState(false);
	const [twoFactorRegistered, setTwoFactorRegistered] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const loadUser = async () => {
			const currentUser = await authService.getCurrentUser();
			addRolesToUser(currentUser);
			setUser(currentUser);
			setLoading(false);
		};

		if (!user) loadUser();
	}, [pathname, user]);

	const signIn = async (email: string, password: string, guid: string) => {
		try {
			const user = (await authService.signIn(email, password, guid)) as User;

			if (user && user?.twoFactorRequired) {
				user.twoFactorUserRegistered?.forEach((item) => {
					if (item.tokenApplication) {
						setTwoFactorRegistered(true);
					}
				});
				setTwoFactorRequired(true);
			}
			console.log(user);

			const data = {
				...user,
				guid,
				produtorId: +user.produtorId,
				prestadorId: +user.prestadorId,
			} as unknown as User;

			addRolesToUser(data);

			setUser(data);
			router.push('/home');
		} catch {
			logout();
		}
	};

	const signInMFA = async (login: string, code: string, guid: string) => {
		try {
			const user = (await authService.signInMFA(login, code, guid)) as User;

			if (user && user?.twoFactorRequired) {
				setTwoFactorRequired(true);
			}
			addRolesToUser(user);
			setUser(user);
			router.push('/home');
		} catch {
			console.log('error');
		}
	};

	const logout = () => {
		setUser(null);
		authService.logout();
	};

	const addRolesToUser = async (user: User) => {
		if (user?.usuarioPerfil && user.usuarioPerfil?.length > 0) {
			const rolesUer = await getUserRoles(user.usuarioPerfil, user.accessToken);
			setRoles(rolesUer);
		}
	};

	const getRolesByPage = (page: string): string[] => {
		return roles?.[page]?.funcionalidades as string[];
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				getRolesByPage,
				loading,
				signIn,
				signInMFA,
				logout,
				twoFactorRequired,
				twoFactorRegistered,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
