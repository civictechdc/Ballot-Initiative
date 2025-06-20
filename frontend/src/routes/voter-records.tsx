import { createFileRoute } from "@tanstack/react-router";
import { FileInput } from "@/components/ui/fileinput";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/hooks/axios";
import DataFrameTable from "@/components/DataFrameTable/dataframetable";
import { useState } from "react";

export const Route = createFileRoute("/voter-records")({
  component: VoterRecord,
});

interface VoterRecord {
  id: string;
  First_Name: string;
  Last_Name: string;
  Street_Number: string;
  Street_Name: string;
  Street_Type: string;
  Street_Dir_Suffix: string;
}

interface VoterRecords {
  rows: VoterRecord[];
  meta: {
    count: number;
    page: number;
    page_size: number;
  };
}

interface CountResponse {
  count: number;
}

type SortDirection = "asc" | "desc";

function VoterRecord() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { data: countData } = useQuery<CountResponse>({
    queryKey: ["voter-records-count"],
    queryFn: async () => {
      const response = await axios.get("/voter_record/count");
      return response.data;
    },
    // Cache data for 5 minutes (5 * 60 * 1000 milliseconds) before considering it stale
    staleTime: 1000 * 60 * 5,
  });

  const { data, isLoading } = useQuery<VoterRecords>({
    queryKey: ["voter-records", page, pageSize, sortField, sortDirection],
    queryFn: async () => {
      const response = await axios.get("/voter_record", {
        params: {
          __page: page,
          __page_size: pageSize,
          __order: sortDirection === "desc" ? `-${sortField}` : sortField,
        },
      });
      return response.data;
    },
    // Cache data for 5 minutes (5 * 60 * 1000 milliseconds) before considering it stale
    staleTime: 1000 * 60 * 5,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1); // Reset to first page when changing sort
  };

  return (
    <div className="text-left">
      <FileInput accept=".csv" id="voter_records" />
      <DataFrameTable 
        data={data?.rows || []} 
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          totalCount: countData?.count || 0,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        sorting={{
          field: sortField,
          direction: sortDirection,
          onSort: handleSort,
        }}
      />
    </div>
  );
}
