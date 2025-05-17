import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
import Image from "next/image";
// import  TrashIcon from '@/public/trash-xmark.svg';
import { Trash } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";



// import { getReportsAndExcel } from "@/backend/controllers/backupController";

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
  attachType: "report" | "excel";
}





   const downloadFile = async({fileName,fileStorage}:{fileName:string,fileStorage:string}) =>{

         try {
           const response = await fetch(
             `${process.env.NEXT_PUBLIC_API_URL}/upload/downloadFile?fileName=${fileName}&fileStorage=${fileStorage}s`,
             {
               method: "GET",
               headers: {
                 "Content-Type": "application/json",
               },
               credentials: "include",
             }
           );

           if (!response.ok) {
             const errorText = await response.text(); // handle error response as text
             console.error(errorText)
             throw new Error(errorText || "Export excel failed");
           }

           console.log("blob");
           const blob = await response.blob();


           console.log(blob);

          //  const date = new Date().toLocaleDateString("en-CA");
           const url = window.URL.createObjectURL(blob);
           const link = document.createElement("a");
           link.href = url;
           link.download = fileName;
           document.body.appendChild(link);
           link.click();
           link.remove();
         } catch (error) {
           console.error("Export error:", error);
         }
   }

const ReportsTable = () => {

  const [excelReportData, setExcelReportData] = useState<ReportsData[]>([]);
  const [isDeleting, setIsDeleting]= useState(false);

  const [isAction,setIsAction] = useState(false);

  const getExcelReport = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/getReportsAndExcel`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    // console.log(data.merged);
    setExcelReportData(data.merged);
  };

  const deleteFile = async ({
    bucket,
    fileName,
    tableName,
    recordId,
  }: {
    bucket: string;
    fileName: string;
    tableName: string;
    recordId: string | number;
  }) => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/deleteFile`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ bucket, fileName, tableName, recordId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("error deleting file " + errorData)
        throw new Error(errorData.error || "Failed to delete file");
      }

      const data = await response.json();
      await getExcelReport();
      setIsDeleting(false);
      toast.success("Sucessfully deleted file!")
      return data;
    } catch (error: any) {
      console.error("Error in deleteFile:", error);
      toast.error("error deleting file " + error)
      throw error;
    }
  };

  
  const exportExcel = async () => {
    setIsAction(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/exportExcel`,
        {
          method: "GET",
          headers: {},
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // handle error response as text
        setIsAction(false);
        toast.error("Error exporting excel " + errorText)
        throw new Error(errorText || "Export excel failed");
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : "default-file.xlsx";
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        fileName
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      await getExcelReport();
      setIsAction(false);
      toast.success("Excel exported!")
    } catch (error) {
      console.error("Export error:", error);
      setIsAction(false);
      toast.error("Error exporting excel" + error)
    }
  };

  const generatePdf = async () => {
    setIsAction(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/generatePdf`,
        {
          method: "GET",
          headers: {},
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // handle error response as text
        setIsAction(false);
        toast.error("Error generating pdf" + errorText)
        throw new Error(errorText || "Export PDF failed");
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");

      const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : "default-file.xlsx";

      console.log(blob);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      await getExcelReport();
      setIsAction(false);
      toast.success("PDF Generated!")
    } catch (error) {
      console.error("Export error:", error);
      setIsAction(false);
      toast.error("Error generating pdf" + error)
    }
  };


  const columns: ColumnDef<ReportsData>[] = [
    {
      id: "download",
      accessorKey: "fileURL",
      header: "",
      cell: ({ row }) => {
        return (
          <Image
            src="/down-to-line.png"
            alt="Excel"
            width={15}
            height={15}
            className="hover:cursor-pointer rounded-full hover:bg-slate-200 m-1 hover:scale-150 transition-all duration-300"
            onClick={() => {
              downloadFile({
                fileName: row.original.fileName,
                fileStorage: row.original.attachType,
              });
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

    { accessorKey: "attachType", header: "Type" },
    {
      id: "delete",
      accessorKey: "fileURL",
      header: "",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        const bucket =
          row.original.attachType === "report" ? "reports" : "excels";
        const fileName = row.original.fileName;
        const tableName =
          row.original.attachType === "report" ? "reports_data" : "excels_data";
        const recordId = row.original.id;

        const handleConfirmDelete = () => {
          deleteFile({ bucket, fileName, tableName, recordId });
        };

        return (
          <>
  {     isDeleting? <Loader className="animate-spin text-blue-500"/>   : <Trash
              className="text-red-500 hover:cursor-pointer hover:bg-slate-200 m-1 rounded-full hover:scale-120 transition-all duration-300 hover:text-red-600"
              onClick={() => setOpen(true)}
            />}

            <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-90" />
                <DialogPrimitive.Content className="fixed z-100 top-[50%] left-[50%] max-w-md w-full bg-white p-6 rounded-md shadow-lg -translate-x-[50%] -translate-y-[50%] focus:outline-none">
                  <DialogPrimitive.Title className="text-lg font-semibold">
                    Confirm Delete
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-2 text-sm text-gray-600">
                    Are you sure you want to delete <strong>{fileName}</strong>?
                  </DialogPrimitive.Description>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      onClick={() => {
                        handleConfirmDelete();
                        setOpen(false);
                      }}
                    >
                      Confirm
                    </button>
                  </div>

                  <DialogPrimitive.Close asChild>
                    <button
                      aria-label="Close"
                      className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
                    >
                      <X size={20} />
                    </button>
                  </DialogPrimitive.Close>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          </>
        );
      },
    },
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
      <div className="flex gap-4 items-center my-5">
        {/* <h1 className="font-bold text-3xl">Reports Log</h1> */}
        <Button
          className="bg-white border-2 border-slate-500 text-black hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
          onClick={() => {
            exportExcel();
          }}
          disabled={isAction}
        >
          <Image
            src="/file-export.png"
            alt="backup-icon"
            width={20}
            height={20}
          />
          Export Excel
        </Button>
        <Button
          className="bg-blue-400 text-black border-2 border-blue-100 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
          onClick={() => {
            generatePdf();
          }}
          disabled={isAction}
        >
          <Image
            src="/file-medical-alt.png"
            alt="backup-icon"
            width={20}
            height={20}
          />
          Generate Report
        </Button>
      </div>

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
