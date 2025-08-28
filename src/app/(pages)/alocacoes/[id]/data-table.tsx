import * as React from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { DataTableRow } from './row';
import { DataTablePagination } from '@/components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	id: number;
	propertySorter?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	id,
	propertySorter = '',
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const [filteredData, setFilteredData] = React.useState<TData[]>(data);
	const [filteredActive, setFilteredActive] = React.useState('true');

	const table = useReactTable({
		data: filteredData,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	function validateDate(date: string) {
		const partes = date.split(' ');
		const dataPartes = partes[0].split('/');

		// Formato: DD/MM/YYYY HH:MM:SS
		const dia = parseInt(dataPartes[0]);
		const mes = parseInt(dataPartes[1]) - 1;
		const ano = parseInt(dataPartes[2]);

		const data = new Date(ano, mes, dia);

		const dataReferencia = new Date(2025, 0, 1); // Janeiro = 0

		return data > dataReferencia;
	}

	React.useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filtered = data.filter((item: any) => validateDate(item.dataInicio));
		setFilteredData(filteredActive === 'true' ? filtered : data);
	}, [filteredActive, data]);

	return (
		<div>
			<div className="flex flex-col md:flex-row items-center pb-4 gap-4">
				<Select
					value={filteredActive}
					onValueChange={(e) => {
						setFilteredActive(e);
					}}
				>
					<SelectTrigger className="w-full md:w-[auto]">
						<SelectValue placeholder="Selecione" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="true">Atuais</SelectItem>
							<SelectItem value="false">Todos</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Input
					placeholder="Filtro"
					value={
						(table.getColumn(propertySorter)?.getFilterValue() as string) ?? ''
					}
					onChange={(event) =>
						table.getColumn(propertySorter)?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
								<TableHead></TableHead>
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table
								.getRowModel()
								.rows.map((row) => (
									<DataTableRow key={row.id} row={row} id={id} />
								))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-right">
									Nenhum resultado encontrado
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}

// import * as React from 'react';
// import {
// 	ColumnDef,
// 	ColumnFiltersState,
// 	SortingState,
// 	flexRender,
// 	getCoreRowModel,
// 	getFilteredRowModel,
// 	getPaginationRowModel,
// 	getSortedRowModel,
// 	useReactTable,
// } from '@tanstack/react-table';

// import { Input } from '@/components/ui/input';
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from '@/components/ui/table';

// import { DataTableRow } from './row';

// import { DataTablePagination } from '@/components/ui/pagination';

// interface DataTableProps<TData, TValue> {
// 	columns: ColumnDef<TData, TValue>[];
// 	data: TData[];
// 	id: number;
// 	propertySorter?: string;
// }

// export function DataTable<TData, TValue>({
// 	columns,
// 	data,
// 	id,
// 	propertySorter = '',
// }: DataTableProps<TData, TValue>) {
// 	const [sorting, setSorting] = React.useState<SortingState>([]);
// 	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
// 		[]
// 	);

// 	const table = useReactTable({
// 		data,
// 		columns,
// 		onSortingChange: setSorting,
// 		getCoreRowModel: getCoreRowModel(),
// 		getPaginationRowModel: getPaginationRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		onColumnFiltersChange: setColumnFilters,
// 		getFilteredRowModel: getFilteredRowModel(),
// 		state: {
// 			sorting,
// 			columnFilters,
// 		},
// 	});

// 	return (
// 		<div>
// 			<div className="flex flex-col md:flex-row items-center pb-4 gap-4">
// 				<Input
// 					placeholder="Filtro"
// 					value={
// 						(table.getColumn(propertySorter)?.getFilterValue() as string) ?? ''
// 					}
// 					onChange={(event) =>
// 						table.getColumn(propertySorter)?.setFilterValue(event.target.value)
// 					}
// 					className="max-w-sm"
// 				/>
// 			</div>
// 			<div className="rounded-md border">
// 				<Table>
// 					<TableHeader>
// 						{table.getHeaderGroups().map((headerGroup) => (
// 							<TableRow key={headerGroup.id}>
// 								{headerGroup.headers.map((header) => {
// 									return (
// 										<TableHead key={header.id}>
// 											{header.isPlaceholder
// 												? null
// 												: flexRender(
// 														header.column.columnDef.header,
// 														header.getContext()
// 												  )}
// 										</TableHead>
// 									);
// 								})}
// 								<TableHead></TableHead>
// 							</TableRow>
// 						))}
// 					</TableHeader>
// 					<TableBody>
// 						{table.getRowModel().rows?.length ? (
// 							table
// 								.getRowModel()
// 								.rows.map((row) => (
// 									<DataTableRow key={row.id} row={row} id={id} />
// 								))
// 						) : (
// 							<TableRow>
// 								<TableCell colSpan={columns.length} className="h-24 text-right">
// 									Nenhum resultado encontrado
// 								</TableCell>
// 							</TableRow>
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>
// 			<DataTablePagination table={table} />
// 		</div>
// 	);
// }
