/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import api from '@/lib/api/axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useCorporation } from '@/providers/useCorporation';
import { useAuth } from '@/providers/useAuth';
export default function AuthPage() {
	const { user, signInMFA, twoFactorRegistered, twoFactorRequired } = useAuth();
	const { corporation } = useCorporation();
	const [qrCodeSrc, setQrCodeSrc] = useState('');

	useEffect(() => {
		!twoFactorRegistered && getData(user?.login);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [twoFactorRegistered]);

	const getData = async (login?: string) => {
		if (twoFactorRequired) {
			const url = `/api/Security/UserAuth/GenerateQRCode?UserName=${login}`;
			await api
				.get(url)
				.then((response) => {
					setQrCodeSrc(response.data.qrCode);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const onRegister = async () => {
		const url = `/api/UsuarioMFA`;
		await api
			.post(url, {
				usuarioID: user?.usuarioID.toString(),
				tipo: 'TokenAuth',
				ativo: true,
				idInclusao: user?.usuarioID.toString(),
			})
			.then((response) => {
				//onSubmit(otp);
				console.log('resitrado', response.data);
			});
	};

	const handleChange = (otp: string) => {
		if (otp.length === 6) {
			onSubmit(otp);
		}
	};

	async function onSubmit(code: string) {
		await signInMFA(
			user?.login || '',
			code,
			corporation?.corporacaoGuid || ''
		).then(() => {
			!twoFactorRegistered && onRegister();
		});
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[80%_20%] md:grid-cols-2 md:grid-rows-1 md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1">
			<div className="min-h-screen flex items-center justify-center">
				<div className="md:w-3/5 flex flex-col justify-center  items-center w-full space-y-8 px-8 text-center">
					{twoFactorRegistered ? (
						<>
							<p className="text-left text-xl font-semibold">
								Autenticação de 2 fatores
							</p>
							<div className="text-left space-y-2">
								<p>
									<span className="text-left text-x font-semibold">1.</span>
									Abra seu App de autenticação e informe o código.
								</p>
							</div>
						</>
					) : (
						<>
							<p className="text-left text-xl font-semibold">
								Autenticação de 2 fatores
							</p>
							<div className="text-left space-y-2">
								<p>
									<span className="text-left text-x font-semibold">1.</span>{' '}
									Faça o download de algum APP de autenticação. Ex. Google
									Authenticator, Microsoft Authenticator.
								</p>
								<p>
									<span className="text-left text-x font-semibold">2.</span>{' '}
									Faça a leitura do qrcode (abaixo) pelo celular no seu APP de
									autenticação
								</p>
							</div>
							{qrCodeSrc && (
								<Image
									src={`data:image/png;base64,${qrCodeSrc}`}
									alt="QR Code"
									width={200}
									height={200}
								/>
							)}
							<p className="text-left">
								<span className="text-left text-x font-semibold">3.</span>{' '}
								Insira no campo abaixo o codigo gerado pelo app de autenticação
								após a leitura do qrcode.
							</p>
						</>
					)}

					<Separator className="mb-6" />
					<InputOTP
						maxLength={6}
						pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
						onChange={handleChange}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
				</div>
			</div>{' '}
			<div className="bg-gray-200  flex items-center justify-center">
				Conteúdo auto
			</div>
		</div>
	);
}
