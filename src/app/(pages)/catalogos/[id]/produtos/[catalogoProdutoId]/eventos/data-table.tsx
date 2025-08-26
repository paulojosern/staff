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

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { DataTableRow } from './row';

import { DataTablePaginationControl } from '@/components/ui/pagination-controled';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import api from '@/lib/api/axios';
import { useCorporation } from '@/providers/useCorporation';
import { DataEvents } from '@/app/(pages)/eventos/models';
import { FormData } from './form';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

interface DataTableProps<TData, TValue> {
	catalogoProdutoId: number;
	columns: ColumnDef<TData, TValue>[];
	events: DataEvents[];
}

export function DataTable<TData, TValue>({
	columns,
	catalogoProdutoId,
	events,
}: DataTableProps<TData, TValue>) {
	const { corporation } = useCorporation();
	const [data, setData] = React.useState<TData[]>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	//actived
	const [filteredData, setFilteredData] = React.useState<TData[]>(data);
	const [filteredActive, setFilteredActive] = React.useState('true');
	React.useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filtered = data.filter((item: any) => item.ativo);

		setFilteredData(filteredActive === 'true' ? filtered : data);
	}, [filteredActive, data]);

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

	function onPageChange(page: number, rowsPerPage?: number) {
		mutate(page, rowsPerPage);
	}

	React.useEffect(() => {
		getData(page, rowsPerPage, 'desc', 'true');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getData = async (
		page: number,
		rowsPerPage: number,
		Sort: string,
		LimiteData: string
	) => {
		const url = `/api/CatalogoProdutoEvento/ListPagination?CatalogoProdutoID=${catalogoProdutoId}&PageStart=${page}&Rows=${rowsPerPage}&Order=10&Sort=${Sort}&LimiteData=${LimiteData}`;

		await api
			.get(url)
			.then((response) => {
				setTotal(response.data.totalResultsCount);
				setData(response.data.eventos);
				// setError('')
			})
			.catch(() => {
				setData([]);
				// setError('Nenhum resultado encontrado')
			});
	};

	const mutate = (
		pageCurrent = page,
		rowsPerPageCurrent = rowsPerPage,
		Sort = 'desc',
		LimiteData = 'true'
	) => {
		setPage(pageCurrent);
		setRowsPerPage(rowsPerPageCurrent);
		getData(pageCurrent, rowsPerPageCurrent, Sort, LimiteData);
	};

	//pagination
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [total, setTotal] = React.useState(0);

	//search
	const [order, setOrder] = React.useState<string>('desc');
	const [limiteData, setLimiteData] = React.useState<string>('true');

	//form
	const [open, setOpen] = React.useState(false);

	return (
		<>
			{open && (
				<FormData
					open={open}
					setOpen={setOpen}
					events={events}
					mutate={mutate}
					catalogoProdutoId={catalogoProdutoId}
				/>
			)}
			{events.length > 0 && (
				<div className=" flex flex-col md:flex-row gap-4 w-full gap-2  align-center  mb-2 mt-2">
					<Button variant="default" onClick={() => setOpen(true)}>
						<CirclePlus />
						Adicionar novo evento no catalogo
					</Button>
				</div>
			)}
			<div className="flex flex-col md:flex-row items-center pb-4 gap-4 mt-2">
				<div className=" grid md:grid-cols-[1fr_1fr_1fr] gap-4 w-full md:w-auto">
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
								<SelectItem value="true">Somente ativos</SelectItem>
								<SelectItem value="false">Todos</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select
						value={limiteData}
						onValueChange={(e) => {
							setLimiteData(e);
							mutate(page, rowsPerPage, order, e);
						}}
					>
						<SelectTrigger className="w-full md:w-[auto]">
							<SelectValue placeholder="Selecione" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="true">Mais recentes</SelectItem>
								<SelectItem value="false">Todos</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					{data?.length > 0 && (
						<Select
							value={order}
							onValueChange={(e) => {
								setOrder(e);
								mutate(page, rowsPerPage, e);
							}}
						>
							<SelectTrigger className="w-full md:w-[auto]">
								<SelectValue placeholder="Select a fruit" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="desc">Decrescente</SelectItem>
									<SelectItem value="asc">Crescente</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
				</div>
			</div>
			{data?.length > 0 && (
				<>
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
											<DataTableRow
												key={row.id}
												row={row}
												mutate={mutate}
												catalogoProdutoId={catalogoProdutoId}
											/>
										))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-right"
										>
											Nenhum resultado encontrado
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					<DataTablePaginationControl
						table={table}
						currentPage={page}
						pageSize={rowsPerPage}
						total={total}
						onPageChange={onPageChange}
					/>
				</>
			)}
		</>
	);
}
