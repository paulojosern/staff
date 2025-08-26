'use client';

import { ModeToggle } from '@/components/elements/themeMode';

import { DataOptions } from '@/components/ui/auto-complete';
import Corporations from './corporations';
import { useEffect, useState } from 'react';
import LoginComponent from './login-component';
import { constants } from '@/lib/constants';
// import { useState } from 'react';
export default function LoginPage() {
	const [login, setLogin] = useState('');
	const [list, setList] = useState<DataOptions[]>([]);

	useEffect(() => {
		localStorage.getItem(constants.CORPORATIONS);
	}, []);

	function goBack() {
		setList([]);
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[80%_20%] md:grid-cols-2 md:grid-rows-1 md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1">
			<div className="min-h-screen flex items-center justify-center">
				<div className="md:w-1/2 flex flex-col  w-full space-y-8 px-8">
					<ModeToggle />

					{list.length > 0 ? (
						<LoginComponent
							login={login}
							list={list}
							goBack={goBack}
							showEmail
						/>
					) : (
						<Corporations setList={setList} setLogin={setLogin} />
					)}
				</div>
			</div>{' '}
			<div className="bg-gray-200  flex items-center justify-center">
				Conteúdo auto
			</div>
		</div>
	);
}
