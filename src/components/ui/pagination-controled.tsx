import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	currentPage: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number, rowsPerPage?: number) => void;
}

export function DataTablePaginationControl<TData>({
	table,
	currentPage,
	pageSize,
	total,
	onPageChange,
}: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center justify-between pt-4">
			<div className="flex-1 text-sm text-muted-foreground"></div>
			<div className="flex items-center space-x-6 lg:space-x-4">
				<div className="flex items-center space-x-2">
					<div className="flex items-center justify-center text-sm">
						Total: {total}
					</div>
					{total > 10 && (
						<Select
							value={`${pageSize}`}
							onValueChange={(value: unknown) => {
								table.setPageSize(Number(value));
								onPageChange(currentPage, Number(value));
							}}
						>
							<SelectTrigger className="h-8 ">
								<SelectValue placeholder={pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 25, 50, 100]?.map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>

				{total > 10 && (
					<div className="flex items-center justify-center text-sm">
						{currentPage + 1} de {Math.ceil(total / pageSize)}
					</div>
				)}
				{total > 10 && (
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => onPageChange(currentPage - 1)}
							disabled={currentPage == 0}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => onPageChange(currentPage + 1)}
							disabled={
								currentPage === total ||
								currentPage + 1 == Math.ceil(total / pageSize)
							}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
