import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { toast } from "sonner";
import { Loader } from "lucide-react";

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

interface BackupData {
  fileName: string;
  fileURL: string;
  id: number;
  created_at: Date;
  fileSize: number;
  status:string;
}

const BackupsTable = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);

  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const [isAction, setIsAction] = useState(false);

  const backupBucket = async () => {
         setIsAction(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/backupBucket`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);
    // alert("BACKUPS bucket");
         setIsAction(false);
  };

  const grabBucket = async () => {
         setIsAction(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/grabBucket`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
         setIsAction(false);
  };

  const getBackups = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/getBackups`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);
    setBackups(data);
  };

  const deleteBackup = async () => {
    setIsAction(true);
    try {
      const selectedBackup = backups.find(
        (backup) => String(backup.id) === selectedRowId
      );

      if (!selectedBackup) {
        console.error("no selected backup");
             setIsAction(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backups/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fileName: selectedBackup.fileName,
            recordId: selectedBackup.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete file");
      }

      const data = await response.json();
      await getBackups();
      // setIsDeleting(false);
      toast.success("Sucessfully deleted file!");
      setIsAction(false);
      return data;
    } catch (error: any) {
      console.error("Error in deleteFile:", error);
      setIsAction(false);
      throw error;
    }
  };

  const columns: ColumnDef<BackupData>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="selectedBackup"
          checked={selectedRowId == String(row.original.id)}
          onChange={() => {
            row.toggleSelected();
            console.log(row.getIsSelected());
          }}
          onClick={() => {
            setSelectedRowId(String(row.original.id));
            console.log(row.original.id);
          }}
          className="hover:cursor-pointer active:scale-70 transition-all duration-300 "
        />
      ),
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
    data: backups,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: {
        [selectedRowId || ""]: true, // Set selected row based on state
      },
    },
    // onRowSelectionChange: (updatedSelection) => {
    //   const selectedId = Object.keys(updatedSelection)[0];
    //   setSelectedRowId(selectedId || null);
    // },
  });

  useEffect(() => {
    getBackups();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Backups</h2>
      <div className="gap-4 flex">
        <Button
        disabled={isAction}
          onClick={() => {
            console.log(selectedRowId);
          }}
          className={`bg-white border-2 border-slate-500 my-5
           text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer`}
        >
          {isAction ?(
            <Loader className="animate-spin duration-1000" />
          ):(
            <Image
              src="/secure-backup.png"
              alt="backup-icon"
              width={20}
              height={20}
            />
          )}
          Create new Backup
        </Button>
        <Button
          onClick={() => {
            console.log(selectedRowId);
          }}
          className={`bg-white border-2 border-slate-500 my-5 text-black 
          p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer `}
          disabled={selectedRowId == "" || isAction}
        >
          {isAction ?(
            <Loader className="animate-spin duration-1000" />
          ):(
          <Image
            src="/folder-download.png"
            alt="backup-icon"
            width={20}
            height={20}
          />)}
          Restore selected Backup
        </Button>
        <Button
          onClick={() => {
            deleteBackup();
          }}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
          disabled={selectedRowId == "" || isAction}
        >
          {isAction ?(
            <Loader className="animate-spin duration-1000" />
          ):(
          <Image
            src="/folder-xmark-circle.png"
            alt="backup-icon"
            width={20}
            height={20}
          />)}
          Delete selected Backup
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

export default BackupsTable;
