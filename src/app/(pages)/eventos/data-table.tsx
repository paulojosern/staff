import * as React from 'react';
import { format } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

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
// import { DataTablePagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DataTablePaginationControl } from '@/components/ui/pagination-controled';
import useDebounce from '@/hooks/useDebounce';
import { CalendarIcon, Trash } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
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

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
	columns,
}: DataTableProps<TData, TValue>) {
	const { corporation } = useCorporation();
	const [data, setData] = React.useState<TData[]>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const table = useReactTable({
		data,
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
		mutate(search, page, rowsPerPage);
	}

	React.useEffect(() => {
		getData('', page, rowsPerPage, 'desc', 'true');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [corporation]);

	const getData = async (
		search = '',
		page: number,
		rowsPerPage: number,
		Sort: string,
		LimiteData: string
	) => {
		const url = `/api/Eventos/ListPagination?CorporacaoGuid=${corporation?.corporacaoGuid}&Search=${search}&CatalogoProdutoID=0&LimiteData=${LimiteData}&PageStart=${page}&Rows=${rowsPerPage}&Order=2&Sort=${Sort}`;
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
		search = '',
		pageCurrent = page,
		rowsPerPageCurrent = rowsPerPage,
		Sort = 'desc',
		LimiteData = 'true'
	) => {
		setPage(pageCurrent);
		setRowsPerPage(rowsPerPageCurrent);
		getData(search, pageCurrent, rowsPerPageCurrent, Sort, LimiteData);
	};

	//pagination
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [total, setTotal] = React.useState(0);

	//search
	const [date, setDate] = React.useState<Date>();
	const [search, setSearch] = React.useState<string>('');
	const [order, setOrder] = React.useState<string>('desc');
	const [limiteData, setLimiteData] = React.useState<string>('true');
	const debouncedSearch = useDebounce(search, 800);

	React.useEffect(() => {
		if (search) {
			mutate(debouncedSearch as string, page, rowsPerPage, order);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch]);

	return (
		<>
			<div className="flex flex-col md:flex-row items-center pb-4 gap-4">
				<div className=" grid grid-cols-[1fr_1fr] gap-4 w-full md:w-auto">
					<Select
						value={limiteData}
						onValueChange={(e) => {
							setLimiteData(e);
							mutate(search, page, rowsPerPage, order, e);
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
								mutate(search, page, rowsPerPage, e);
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
				{data?.length > 0 && (
					<>
						<Input
							placeholder="Filtro"
							onChange={(event) => {
								if (event.target.value === '') {
									mutate('', page, rowsPerPage);
								}

								setSearch(event.target.value);
							}}
							className="max-w-sm"
						/>
						<div className=" grid grid-cols-[1fr_auto] gap-4 w-full md:w-auto">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={'outline'}
										className={cn(
											'w-full justify-start text-left font-normal',
											!date && 'text-muted-foreground'
										)}
									>
										<CalendarIcon />
										{date ? (
											format(date, 'dd/MM/yyyy')
										) : (
											<span>Pesquise por data do evento</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={(e) => {
											if (e) {
												setDate(e);
												setSearch(format(e, 'yyyy-MM-dd'));
											}
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											onClick={() => {
												setDate(undefined);
												mutate('', page, rowsPerPage);
											}}
										>
											<Trash />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Limpar pesquisa</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</>
				)}
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
										<TableHead>Acesso</TableHead>
										<TableHead>Leitura</TableHead>
										<TableHead></TableHead>
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table
										.getRowModel()
										.rows.map((row) => (
											<DataTableRow key={row.id} row={row} mutate={mutate} />
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
