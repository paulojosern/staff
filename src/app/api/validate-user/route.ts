import { NextRequest, NextResponse } from 'next/server';

interface PessoaResponse {
	pessoaID: number;
}

interface UsuarioResponse {
	// definir estrutura conforme necessário
	[key: string]: string | object;
}

interface ValidationResult {
	pessoaID?: string;
	usuarioExiste: boolean;
	usuarioData?: UsuarioResponse;
	error?: string;
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const documento = searchParams.get('documento');
	const corporacaoGuid = searchParams.get('corporacaoGuid');

	if (!documento || !corporacaoGuid) {
		return NextResponse.json(
			{ error: 'Documento e corporacaoGuid são obrigatórios' },
			{ status: 400 }
		);
	}

	try {
		const result = await validatePessoa(documento, corporacaoGuid);
		return NextResponse.json(result);
	} catch {
		return NextResponse.json(
			{ error: 'Pessoa não encontrada' },
			{ status: 404 }
		);
	}
}

async function validatePessoa(
	documento: string,
	corporacaoGuid: string
): Promise<ValidationResult | undefined> {
	const tipoDocumento = documento.length > 11 ? 'CNPJ' : 'CPF';
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || 'https://soudaliga.ligatechapis.com';

	try {
		// Primeiro request: buscar pessoa
		const pessoaResponse = await fetch(
			`${baseUrl}/api/Pessoa/GetDocumento?TipoDocumento=${tipoDocumento}&Numero=${documento}&CorporacaoGuid=${corporacaoGuid}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const pessoaData: PessoaResponse = await pessoaResponse.json();

		const user = await validateUsuario(
			documento,
			corporacaoGuid,
			pessoaData.pessoaID.toString()
		);

		return {
			pessoaID: pessoaData.pessoaID.toString(),
			usuarioExiste: !!user?.usuarioData?.usuarioID,
		};
	} catch {
		return {
			usuarioExiste: false,
			error: 'Pessoa não encontrada',
		};
	}
}

async function validateUsuario(
	documento: string,
	corporacaoGuid: string,
	pessoaID: string
): Promise<ValidationResult> {
	const tipoDocumento = documento.length > 11 ? 'CNPJ' : 'CPF';
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || 'https://soudaliga.ligatechapis.com';

	try {
		const usuarioResponse = await fetch(
			`${baseUrl}/api/usuario/GetDocumento?TipoDocumento=${tipoDocumento}&Numero=${documento}&CorporacaoGuid=${corporacaoGuid}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const usuarioData: UsuarioResponse = await usuarioResponse.json();

		return {
			usuarioExiste: !!usuarioData && Object.keys(usuarioData).length > 0,
			usuarioData,
			error:
				usuarioData && Object.keys(usuarioData).length > 0
					? 'Usuário ja cadastrado'
					: undefined,
		};
	} catch {
		return {
			pessoaID,
			usuarioExiste: false,
		};
	}
}
