import DataFrameTable from "@/components/DataFrameTable/dataframetable";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/fileinput";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOCR } from "@/hooks/petition/useOCR";
import { createFileRoute } from "@tanstack/react-router";
import Markdown from "react-markdown";
import { useState, useMemo, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BACKEND_URL } from "@/constants";

export const Route = createFileRoute("/petition")({
  component: Petition,
});

type Step = "upload" | "process" | "results";

function Petition() {
  const OCR = useOCR();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep === "process") {
      const eventSource = new EventSource(`${BACKEND_URL}/ocr/logs`);
      
      eventSource.onmessage = (event) => {
        const logEntry = JSON.parse(event.data);
        setLogs(prev => [...prev, `${logEntry.timestamp} [${logEntry.level.toUpperCase()}] ${logEntry.message}`]);
        
        // Update progress based on log messages
        if (logEntry.message.includes("Starting OCR processing")) {
          setProgress(10);
        } else if (logEntry.message.includes("Processing file")) {
          setProgress(30);
        } else if (logEntry.message.includes("Compiling Voter Record Data")) {
          setProgress(50);
        } else if (logEntry.message.includes("Matching petition signatures")) {
          setProgress(70);
        } else if (logEntry.message.includes("OCR processing completed")) {
          setProgress(100);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [currentStep]);

  const handleProcessFiles = () => {
    setLogs([]);
    setProgress(0);
    OCR.mutate(undefined, {
      onSuccess: () => {
        setCurrentStep("results");
      }
    });
    setCurrentStep("process");
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1); // Reset to first page when changing sort
  };

  // Get the data from OCR response and implement client-side pagination and sorting
  const { paginatedData, totalCount } = useMemo(() => {
    const allData = OCR.data?.data || [];

    // Sort the data
    const sortedData = [...allData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return {
      paginatedData,
      totalCount: allData.length
    };
  }, [OCR.data?.data, page, pageSize, sortField, sortDirection]);

  // Statistics calculation
  const stats = useMemo(() => {
    const allData = OCR.data?.data || [];
    const total = allData.length;
    let valid = 0;
    let invalid = 0;
    for (const row of allData) {
      if (row.Valid === true) valid++;
      else invalid++;
    }
    return { total, valid, invalid };
  }, [OCR.data?.data]);

  // CSV export utility
  function exportToCSV() {
    const allData = OCR.data?.data || [];
    if (!allData.length) return;
    const columns = Object.keys(allData[0]);
    const csvRows = [
      columns.join(","),
      ...allData.map((row: any) =>
        columns.map(col => {
          let val = row[col];
          if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
          if (val === null || val === undefined) return "";
          return String(val).replace(/"/g, '""');
        }).map(val => `"${val}"`).join(",")
      )
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "petition_results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const steps = [
    { id: "upload", label: "Upload Files" },
    { id: "process", label: "Process Files" },
    { id: "results", label: "View Results" },
  ] as const;

  const renderers = {
    Valid: (value: boolean) => (
      <input type="checkbox" checked={!!value} readOnly className="accent-blue-600 w-4 h-4" />
    ),
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 text-left">

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === step.id ? "bg-blue-600 text-white" :
                  steps.findIndex(s => s.id === currentStep) > index ? "bg-green-600 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-sm mt-2">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-0.5mx-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === "upload" && (
          <div className="text-center">
            <p>Upload your files to begin the validation process.</p>
            <div className="grid grid-cols-1 gap-4 max-w-1/2 mx-auto">
              <div>
                <Markdown>{`
#### ✍️ Ballot Signatures
Upload your PDF file containing ballot pages with signatures. Each file will be cropped to focus on the section where the signatures are located. 
Ensure these sections have the printed name and address of the voter. 
`}
                </Markdown>
              </div>
              <div>
                <Label htmlFor="petition-signatures">Choose PDF file:</Label>
                <FileInput id="petition_signatures" accept=".pdf" />
              </div>
            </div>
            <div className="mt-8">
              <Button
                variant="destructive"
                className="w-full md:w-1/2"
                onClick={handleProcessFiles}
                disabled={OCR.isPending}
              >
                {OCR.isPending ? <>Processing</> : <>🚀 Process Files</>}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "process" && (
          <div className="text-center py-8">
            <div className="max-w-screen mx-auto">
              <Progress value={progress} className="mb-4" />
              <p className="mb-4 text-lg">Processing your files... {progress}%</p>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4 text-left">
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {currentStep === "results" && (
          <>
            <div className="my-5">
              <h3>Results</h3>

              <Tabs defaultValue="datatable" className="flex-1">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="datatable" className="flex-1">📊 Data Table</TabsTrigger>
                    <TabsTrigger value="statistics" className="flex-1">📈 Statistics</TabsTrigger>
                  </TabsList>
                  <Button
                    variant="outline"
                    className="ml-4"
                    onClick={exportToCSV}
                    disabled={!OCR.data?.data?.length}
                  >
                    📥 Export CSV
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep("upload");
                        OCR.reset();
                      }}
                    >
                      🔄 Start Over
                    </Button>
                </div>
                <TabsContent value="datatable" className="w-full overflow-x-auto">
                  <DataFrameTable
                    data={paginatedData}
                    isLoading={OCR.isPending}
                    pagination={{
                      page,
                      pageSize,
                      totalCount,
                      onPageChange: setPage,
                      onPageSizeChange: setPageSize,
                    }}
                    sorting={{
                      field: sortField,
                      direction: sortDirection,
                      onSort: handleSort,
                    }}
                    renderers={renderers}
                  />
                </TabsContent>
                <TabsContent value="statistics">
                  <div className="p-6 bg-card rounded-lg shadow-md w-full max-w-md mx-auto border">
                    <h4 className="text-lg font-semibold mb-4">Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Voter Records:</span>
                        <span className="font-bold">{stats.total}</span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Valid Matches:</span>
                        <span className="font-bold">{stats.valid}</span>
                      </div>
                      <div className="flex justify-between text-red-600 dark:text-red-400">
                        <span>Invalid Matches:</span>
                        <span className="font-bold">{stats.invalid}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
