'use client';

import { useCallback } from 'react';
import { Button } from './button';

interface PaginationControlsProps {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	siblingCount?: number;
}

export function PaginationControls({
	currentPage,
	pageSize,
	totalItems,
	onPageChange,
	siblingCount = 1,
}: PaginationControlsProps) {
	const totalPages = Math.ceil(totalItems / pageSize);

	const handlePageChange = useCallback(
		(page: number) => {
			if (page > 0 && page <= totalPages) {
				onPageChange(page);
			}
		},
		[onPageChange, totalPages]
	);

	// Generate page numbers to show
	const generatePagination = () => {
		// Always show first page, last page, current page, and siblings of current page
		const pageNumbers = new Set<number>();

		// Add current page and siblings
		for (
			let i = Math.max(1, currentPage - siblingCount);
			i <= Math.min(totalPages, currentPage + siblingCount);
			i++
		) {
			pageNumbers.add(i);
		}

		// Add first and last page
		pageNumbers.add(1);
		if (totalPages > 1) {
			pageNumbers.add(totalPages);
		}

		// Convert to array and sort
		return Array.from(pageNumbers).sort((a, b) => a - b);
	};

	const pageNumbers = generatePagination();

	return (
		<div className="flex items-center space-x-2">
			<Button
				onClick={(e) => {
					e.preventDefault();
					handlePageChange(currentPage - 1);
				}}
				aria-disabled={currentPage <= 1}
				className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
			>
				k1
			</Button>

			{pageNumbers.map((page, index) => {
				// Add ellipsis if there's a gap
				const previousPage = pageNumbers[index - 1];
				if (previousPage && page - previousPage > 1) {
					return <div key={`ellipsis-${page}`}>....</div>;
				}

				return (
					<Button
						key={page}
						// isActive={page === currentPage}
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(page);
						}}
					>
						{page}
					</Button>
				);
			})}

			<Button
				onClick={(e) => {
					e.preventDefault();
					handlePageChange(currentPage + 1);
				}}
				aria-disabled={currentPage >= totalPages}
				className={
					currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
				}
			>
				indo
			</Button>
		</div>
	);
}
