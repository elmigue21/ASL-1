import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  Row,
  // Table,
} from "@tanstack/react-table";
import CloseButton from "../components/CloseButton";
import { toastError } from "@/utils/toastError";
import { Subscription } from "@/types/subscription";

interface FailedSubscription extends Subscription {
  reason: string;
}

type Person = {
  created_on: string;
  first_name: string;
  last_name: string;
  occupation: string;
  field1: string;
  person_linkedin_url: string;
  company: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  company_website: string;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  person_facebook_url: string;
  company_linked_in: string;
};

const UploadTab = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [data, setData] = useState<Person[]>([]);
  const [columns, setColumns] = useState<ColumnDef<Person>[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const TARGET_COLUMNS = [
    "created_on",
    "first_name",
    "last_name",
    "occupation",
    "person_linkedin_url",
    "company",
    "city",
    "state",
    "country",
    "industry",
    "company_website",
    "email1",
    "email2",
    "phone1",
    "phone2",
    "person_facebook_url",
    "company_linked_in",
  ];

const handleGetSelectedData = async () => {
  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  console.log("Selected data count:", selectedData.length);

  const batchSize = 50;

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const batches = chunkArray(selectedData, batchSize);

  console.log("Number of batches:", batches.length);

  try {
    for (const [index, batch] of batches.entries()) {
      console.log(`Sending batch ${index + 1} with ${batch.length} items`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/insertUpload`,
        {
          method: "POST",
          body: JSON.stringify({ subscriptions: batch }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `Error sending batch ${index + 1}:`,
          response.statusText,
          errorBody
        );
        break; // stop on error, or remove this line to continue
      }

      const data = await response.json();
      console.log(data);
      data.invalidSubscriptions.forEach((failedSub : FailedSubscription) => {
        toastError({
          title: `Failed: ${failedSub.first_name} ${failedSub.last_name}`,
          description: failedSub.reason,
        });
      });
    }
  } catch (e) {
    console.error(e);
  }
};

  const readFileUpload = async () => {
    console.log("read file upload");
    if (!file) return;
    setIsUploading(true);

    console.log("file exists");

    const reader = new FileReader();

    reader.onload = (evt) => {
      const binaryStr = evt.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawJson = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

      // Only include target columns
      const filteredData = rawJson.map((row) => {
        const filteredRow: Record<string, string> = {};
        TARGET_COLUMNS.forEach((col) => {
          filteredRow[col] = row[col] ?? ""; // default to empty if missing
        });
        return filteredRow;
      });

      const cols = TARGET_COLUMNS.map((key) => ({
        header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), // optional: prettify
        accessorKey: key,
      }));

      setColumns(cols);
      setData(filteredData as Person[]);
      setIsUploading(false);
      setIsOpen(true);
    };

    reader.readAsBinaryString(file);
  };

  const checkboxColumn: ColumnDef<Person> = {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: { row: Row<Person> }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  };

  const allColumns: ColumnDef<Person>[] = [checkboxColumn, ...columns];

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const handleUpload = async () => {
  //   if (!file) {
  //     alert("No file selected!");
  //     return;
  //   }

  //   setIsUploading(true);

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadFile`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         credentials: "include",
  //       }
  //     );

  //     const result = await response.json();

  //     if (!response.ok) throw new Error(result.error || "Upload failed");
  //     console.log(result);
  //     alert("Upload successful: " + result.message);
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     alert("Upload failed");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // const insertUpload = async () => {
  //   try {
  //     console.log(data);

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/upload/insertUpload`,
  //       {
  //         method: "POST",
  //         // body: {},
  //         credentials: "include",
  //       }
  //     );
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center">
        <div className="bg-orange-500 h-2 w-2 mx-2 rounded-full"></div>
        <h1 className="font-bold text-4xl">Data Upload</h1>
      </div>

      <div className="bg-orange-500 h-2"></div>
      <p>
        Accepted columns:{" "}
        {
          "created_on, first_name, last_name, occupation, person_linkedin_url, company, city, state, country, industry, company_website, email1, email2, phone1, phone2, person_facebook_url, company_linked_in"
        }
      </p>

      <p>Drag file or select from your local pc</p>
      <Input
        placeholder="Upload Excel File"
        id="file-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="shadow-xl bg-orange-100 hover:bg-orange-200 w-[500px] h-[200px] border-4 border-blue-500 border-dashed"
      />
      <Button onClick={readFileUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Excel"}
      </Button>

      <div
        className={`fixed top-1/6 left-1/2 transform -translate-x-1/2
             bg-red-500 h-[80vh] w-[80vw]
             overflow-auto p-4 z-50 rounded-lg shadow-lg ${
               isOpen ? "block" : "hidden"
             }`}
      >
        <div>
          <CloseButton
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>
        <div className="min-w-max">
          {data.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border px-4 py-2 text-left text-sm font-semibold"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border px-4 py-2 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Button
          className="absolute bottom-0 right-0 opacity-80 hover:opacity-100"
          onClick={() => {
            handleGetSelectedData();
          }}
        >
          Insert to Database
        </Button>
      </div>
    </div>
  );
};

export default UploadTab;
