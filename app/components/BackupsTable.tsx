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
import { toast } from "sonner";

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
}

const BackupsTable = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);

  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const [backupCreating, setBackupCreating] = useState(false);
  const [reRender, setReRender] = useState(false);

  const backupBucket = async () => {
    console.log("back up bucket");
    try {
      toast.custom(() => (
        <div className="border border-black bg-slate-100 text-black px-4 py-2 rounded-md shadow">
          Creating backup of current data...
        </div>
      ));
      setBackupCreating(true);
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
      // toast.success("Backup created successfully!");
      setReRender(true);
    } catch (error: any) {
      console.error("Backup failed:", error);
      toast.error(`Failed to create backup: ${error.message}`);
    }
  };



  useEffect(() => {
    // This will run every time backupDone changes
    if(backupCreating && reRender){
    toast.success("Backup DONE!")
    setReRender(false);
    setBackupCreating(false);
    getBackups();
    }
    // You can fetch new data or do anything here
  }, [reRender]);

  const grabBucket = async () => {

    const selectedBackup = backups.find(
  (backup) => String(backup.id) === selectedRowId
);
if(!selectedBackup){
  console.error("no selected backup")
  return;
}

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/grabBucket?backupName=${selectedBackup.fileName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include"
      }
    );
    const data = await response.json();
    console.log(data);
    alert("BACKUPS bucket");
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
          onClick={() => {
            backupBucket();
          }}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
        >
          <Image
            src="/secure-backup.png"
            alt="backup-icon"
            width={20}
            height={20}
          />
          Create new Backup
        </Button>
        <Button
          onClick={() => {
            grabBucket()
          }}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
          disabled={selectedRowId == ""}
        >
          <Image
            src="/folder-download.png"
            alt="backup-icon"
            width={20}
            height={20}
          />
          Restore selected Backup
        </Button>
        <Button
          onClick={() => {
            console.log(selectedRowId);
          }}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
          disabled={selectedRowId == ""}
        >
          <Image
            src="/folder-xmark-circle.png"
            alt="backup-icon"
            width={20}
            height={20}
          />
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
