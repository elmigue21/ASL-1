import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { getReportsAndExcel } from "@/backend/controllers/backupController";

// type Backup = {
//   id: string;
//   date: string;
//   size: string;
//   status: "Completed" | "Pending" | "Failed";
// };

// const backupData: Backup[] = [
//   { id: "1", date: "2025-05-01", size: "500MB", status: "Completed" },
//   { id: "2", date: "2025-05-02", size: "320MB", status: "Pending" },
//   { id: "3", date: "2025-05-03", size: "1.2GB", status: "Failed" },
// ];

interface ReportsData {
  fileName: string;
  url: string;
  id: number;
  created_at: Date;
  fileSize: number;
}




const downloadFile = async (fileUrl: string) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/download/downloadFile?fileUrl=${fileUrl}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Attach token in request
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    const blob = await response.blob(); // Convert response to a Blob (binary data)
    const downloadUrl = window.URL.createObjectURL(blob); // Create URL for the Blob
    const link = document.createElement("a");
    link.href = downloadUrl;
    if (typeof fileUrl === "string") {
      link.download = fileUrl.split("/").pop() || "downloaded_file";
    } else {
      console.error("Invalid fileUrl");
    }
    //   link.download = fileUrl.split("/").pop(); // Filename for download
    document.body.appendChild(link); // Append link to the DOM (necessary for Firefox)
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
  } else {
    console.error("File download failed");
  }
  const data = await response.json();
  console.log(data);
};

const ReportsTable = () => {

  const [excelReportData, setExcelReportData] = useState<ReportsData[]>([]);

  const getExcelReport = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/getReportsAndExcel`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token in request
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data.merged);
    setExcelReportData(data.merged);
  };


  const columns: ColumnDef<ReportsData>[] = [
    {
      accessorKey: "fileURL",
      header: "",
      cell: ({ row }) => {
        return (
          <Image
            src="/down-to-line.png"
            alt="Excel"
            width={15}
            height={15}
            onClick={() => {
              downloadFile(row.original.url);
            }}
          />
        );
      },
    },
    { accessorKey: "id", header: "ID" },
    { accessorKey: "fileName", header: "File Name" },
    {
      accessorKey: "created_at",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric", // E.g., "2025"
          month: "long", // E.g., "May"
          day: "numeric", // E.g., "3"
        });
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" }); // Get the weekday

        return `${formattedDate} - ${weekday}`;
      },
    },
    {
      accessorKey: "fileSize",
      header: "Size (MB)",
      cell: ({ getValue }) => {
        const bytes = getValue<number>();
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
      },
    },

    { accessorKey: "status", header: "Status" },
  ];

  const table = useReactTable({
    data: excelReportData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // onRowSelectionChange: (updatedSelection) => {
    //   const selectedId = Object.keys(updatedSelection)[0];
    //   setSelectedRowId(selectedId || null);
    // },
  });

    useEffect(() => {
      getExcelReport();
    }, []);

  return (
    
    <div className="p-4">
      <table className="min-w-full border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-4 py-2 text-left">
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
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
