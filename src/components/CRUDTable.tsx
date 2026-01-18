'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, MoreHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface CRUDTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  title: string;
  description: string;
  onAdd?: () => void;
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  // Server-side pagination props
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Server-side search prop
  onSearchChange?: (searchTerm: string) => void;
  isLoading?: boolean;
}

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const CRUDTable = React.memo(function CRUDTable<TData, TValue>({
  data,
  columns,
  title,
  description,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
  pagination,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  isLoading = false,
}: CRUDTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isInitializedRef = useRef(false);

  // Debounce search term (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Trigger search change when debounced value changes (only after initial render)
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    if (onSearchChange) {
      onSearchChange(debouncedSearchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const actionColumn: ColumnDef<TData> = {
    id: 'actions',
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const tableColumns = [...columns, actionColumn];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const pageSizeOptions = [10, 25, 50, 100];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {isLoading && (
            <div className="absolute right-2 top-2.5 h-4 w-4">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Records Per Page Selector */}
        {pagination && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">per page</span>
          </div>
        )}
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
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        {/* Records Info */}
        {pagination && (
          <div className="text-sm text-gray-500">
            Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} records
            {pagination.total > pagination.pageSize && (
              <span className="ml-2">
                (Page {pagination.page} of {pagination.pageCount})
              </span>
            )}
          </div>
        )}

        {/* Pagination Buttons */}
        {pagination && onPageChange && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pageCount || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}) as typeof CRUDTable;
