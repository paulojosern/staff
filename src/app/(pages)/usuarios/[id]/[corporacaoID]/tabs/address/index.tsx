import { DataUserDetail, PessoaDataCurrent } from '../../../../models';
import { useAuth } from '@/providers/useAuth';
import AddressItem from './item';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { KeyedMutator } from 'swr';
import dynamic from 'next/dynamic';
const FormDataAddress = dynamic(
	() => import('./form').then((mod) => mod.FormDataAddress),
	{
		ssr: false,
	}
);

interface Props {
	userSearch: DataUserDetail;
	pessoa: PessoaDataCurrent;
	mutate: KeyedMutator<unknown>;
}

export default function TabAddress({ pessoa, mutate }: Props) {
	const { getRolesByPage } = useAuth();
	const roles = getRolesByPage('usuarios');
	const enabled = roles?.includes('user_register') || false;

	const [open, setOpen] = useState(false);

	const list =
		pessoa.pessoaEndereco.length > 0
			? ['Cobrança', 'Comercial', 'Residencial'].filter(
					(i) =>
						!pessoa.pessoaEndereco?.map((i) => i?.tipoEndereco)?.includes(i)
			  )
			: ['Cobrança', 'Comercial', 'Residencial'];

	return (
		<div>
			{list.length > 0 && (
				<>
					<div className="flex mb-4">
						<Button
							variant="outline"
							disabled={!enabled}
							onClick={() => setOpen(true)}
						>
							Cadastrar formulário
						</Button>
					</div>
					{open && (
						<FormDataAddress
							pessoaID={pessoa.pessoaID}
							open={open}
							setOpen={setOpen}
							list={list}
							mutate={mutate}
						/>
					)}
				</>
			)}
			<div className="w-full flex flex-col  gap-4 mb-4 ">
				{pessoa?.pessoaEndereco?.map((item, index) => (
					<AddressItem
						key={index}
						address={item}
						enabled={enabled}
						mutate={mutate}
					/>
				))}
			</div>
		</div>
	);
}
