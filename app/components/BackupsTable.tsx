import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface BackupData {
  fileName: string;
  fileURL: string;
  id: number;
  created_at: Date;
  fileSize: number;
  status: string;
}

const BackupsTable = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [isAction, setIsAction] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    desc:string;
    action: () => Promise<void>;
  } | null>(null);

  // API calls for backup actions
  const createBackup = async () => {
    setIsAction(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backups/backupBucket`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      toast.success("Backup created successfully!");
    } catch (error) {
      toast.error("Failed to create backup");
    } finally {
      setIsAction(false);
      await getBackups();
    }
  };

  const restoreBackup = async () => {
    setIsAction(true);
    try {
      if (!selectedRowId) {
        toast.error("Please select a backup to restore.");
        setIsAction(false);
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backups/grabBucket`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      toast.success("Backup restored successfully!");
    } catch (error) {
      toast.error("Failed to restore backup");
    } finally {
      setIsAction(false);
      await getBackups();
    }
  };

  const deleteBackup = async () => {
    setIsAction(true);
    try {
      const selectedBackup = backups.find(
        (backup) => String(backup.id) === selectedRowId
      );

      if (!selectedBackup) {
        toast.error("Please select a backup to delete.");
        setIsAction(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backups/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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

      toast.success("Successfully deleted backup!");
      await getBackups();
    } catch (error) {
      toast.error("Failed to delete backup");
    } finally {
      setIsAction(false);
    }
  };

  const getBackups = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backups/getBackups`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    setBackups(data);
  };

  useEffect(() => {
    getBackups();
  }, []);

  // Map label to actual async functions
  const options = [
    { label: "Create Backup", action: createBackup, desc:"Create backup of the current state of the database?" },
    { label: "Restore Backup", action: restoreBackup ,desc:"Restore database to state of selected backup?"},
    { label: "Delete Backup", action: deleteBackup ,desc:"Are you sure you want to delete the selected backup?"},
  ];

  function openConfirmDialog(optionLabel: string) {
    const option = options.find((o) => o.label === optionLabel);
    if (option) {
      setSelectedOption(option);
      setOpenDialog(true);
    }
  }

  // Table setup
  const columns: ColumnDef<BackupData>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="selectedBackup"
          checked={selectedRowId === String(row.original.id)}
          onChange={() => {
            setSelectedRowId(String(row.original.id));
          }}
          className="hover:cursor-pointer active:scale-90 transition-all duration-300"
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
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });
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
  });

  return (
    <div className="p-4">
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] z-[9999]">
          <DialogHeader>
            <DialogTitle>{selectedOption?.label}</DialogTitle>
            <DialogDescription>{selectedOption?.desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:cursor-pointer"
              disabled={isAction}
              onClick={async () => {
                if (selectedOption) {
                  await selectedOption.action();
                  setOpenDialog(false);
                }
              }}
            >
              {isAction ? <Loader className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buttons for actions */}
      <div className="gap-4 flex">
        <Button
          disabled={isAction}
          onClick={() => openConfirmDialog("Create Backup")}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
        >
          {isAction ? (
            <Loader className="animate-spin duration-1000" />
          ) : (
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
          disabled={selectedRowId === "" || isAction}
          onClick={() => openConfirmDialog("Restore Backup")}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
        >
          {isAction ? (
            <Loader className="animate-spin duration-1000" />
          ) : (
            <Image
              src="/folder-download.png"
              alt="backup-icon"
              width={20}
              height={20}
            />
          )}
          Restore selected Backup
        </Button>
        <Button
          disabled={selectedRowId === "" || isAction}
          onClick={() => openConfirmDialog("Delete Backup")}
          className="bg-white border-2 border-slate-500 my-5 text-black p-5 hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
        >
          {isAction ? (
            <Loader className="animate-spin duration-1000" />
          ) : (
            <Image
              src="/folder-xmark-circle.png"
              alt="backup-icon"
              width={20}
              height={20}
            />
          )}
          Delete selected Backup
        </Button>
      </div>

      {/* Backups Table */}
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
