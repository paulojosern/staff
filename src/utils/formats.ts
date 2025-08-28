import { format } from 'date-fns-tz';
export const formateReal = (value?: number | string): string => {
	const v = typeof value === 'string' ? parseFloat(value) : value;
	return (
		v?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) || ''
	);
};

export function formatDate(value: string): string {
	const data = new Date(Date.parse(value));

	if (isNaN(data.getTime())) {
		throw new Error('Data inválida');
	}
	return format(data, 'dd/MM/yyyy HH:mm');
}

export function formatOnlyDate(value: string): string {
	const data = new Date(Date.parse(value));

	if (isNaN(data.getTime())) {
		throw new Error('Data inválida');
	}
	return format(data, 'dd/MM/yyyy');
}

export const maskPhoneDDD = (value = '') => {
	return value
		?.replace(/\D/g, '')
		.replace(/(\d{2})(\d)/, '($1) $2')
		.replace(/(\d{4})(\d)/, '$1-$2')
		.replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
		.replace(/(-\d{4})\d+?$/, '$1');
};

export const cpfCnpj = (v: string) => {
	if (v) {
		v = v.replace(/\D/g, '');
		if (v.length <= 11) {
			v = v.replace(/(\d{3})(\d)/, '$1.$2');
			v = v.replace(/(\d{3})(\d)/, '$1.$2');
			v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
		} else {
			v = v
				.replace(/(\d{2})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1/$2')
				.replace(/(\d{4})(\d)/, '$1-$2')
				.replace(/(-\d{2})\d+?$/, '$1');
		}
	}
	return v;
};
