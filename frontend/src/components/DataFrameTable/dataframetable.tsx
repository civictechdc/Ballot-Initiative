import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";

export interface DataFrameTableProps {
  data: Record<string, any>[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting: {
    field: string;
    direction: "asc" | "desc";
    onSort: (field: string) => void;
  };
  renderers?: { [key: string]: (value: any, row?: any) => React.ReactNode };
}

export default function DataFrameTable({ data, isLoading, pagination, sorting, renderers }: DataFrameTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const columns = Object.keys(data[0]).map((key) => ({
    accessorKey: key,
    header: key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
  }));
  const totalPages = pagination ? Math.ceil(pagination.totalCount / pagination.pageSize) : 1;
  const startEntry = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1;
  const endEntry = pagination ? Math.min(pagination.page * pagination.pageSize, pagination.totalCount) : 0;

  const getSortIcon = (field: string) => {
    if (field !== sorting.field) return <ArrowUpDown className="h-4 w-4" />;
    return sorting.direction === "asc" ? 
      <ArrowUpDown className="h-4 w-4 rotate-180" /> : 
      <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.accessorKey} 
                  className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => sorting.onSort(column.accessorKey)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {getSortIcon(column.accessorKey)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-t">
                {columns.map((column) => (
                  <TableCell key={column.accessorKey} className="px-4 py-2">
                    {renderers && renderers[column.accessorKey]
                      ? renderers[column.accessorKey](row[column.accessorKey], row)
                      : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {startEntry} to {endEntry} of {pagination.totalCount} entries
            </p>
          </div>

          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.page} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => pagination.onPageChange(totalPages)}
                disabled={pagination.page === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
