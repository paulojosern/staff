import { useState } from 'react';
import { PessoaEnderecoData } from '../../../../models';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { KeyedMutator } from 'swr';

const FormDataAddress = dynamic(
	() => import('./form').then((mod) => mod.FormDataAddress),
	{
		ssr: false,
	}
);

interface Props {
	address: PessoaEnderecoData;
	enabled: boolean;
	mutate: KeyedMutator<unknown>;
}

export default function AddressItem({ address, enabled, mutate }: Props) {
	const [open, setOpen] = useState(false);
	return (
		<div className="w-full  p-4 border rounded-md">
			{open && (
				<FormDataAddress
					list={['Comercial', 'Residencial', 'Cobrança']}
					item={address}
					open={open}
					setOpen={setOpen}
					pessoaID={address.pessoaID}
					mutate={mutate}
				/>
			)}
			<div className="font-medium text-lg mb-2">{address.tipoEndereco}</div>
			<div className="flex flex-row flex-wrap gap-8 mb-3">
				<div>
					<label className="text-sm block opacity-60">Nome do endereço</label>
					{address.nomeEndereco}
				</div>

				<div>
					<label className="text-sm block opacity-60">Cep</label>
					{address.cep}
				</div>
			</div>
			<div className="flex flex-row flex-wrap gap-4 md:gap-8">
				<div>
					<label className="text-sm block opacity-60">Rua</label>
					{address.logradouro}
				</div>
				<div>
					<label className="text-sm block opacity-60">Número</label>
					{address.numero}
				</div>
				<div>
					<label className="text-sm block opacity-60">Complemnto</label>
					{address.complemento}
				</div>
				<div>
					<label className="text-sm block opacity-60">Bairro</label>
					{address.bairro}
				</div>
				<div>
					<label className="text-sm block opacity-60">Cidade</label>
					{address.cidade}
				</div>
				<div>
					<label className="text-sm block opacity-60">Estado</label>
					{address.uf}
				</div>
			</div>
			<div className="mt-4  flex flex-row gap-2 items-center justify-between">
				<div>
					<label className="text-sm block opacity-60">Status</label>
					{address.ativo ? 'Ativo' : 'Inativo'}
				</div>
				<Button
					variant="default"
					className="ml-auto"
					disabled={!enabled}
					onClick={() => setOpen(true)}
				>
					Editar
				</Button>
			</div>
		</div>
	);
}
