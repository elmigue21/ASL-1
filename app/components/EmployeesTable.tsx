'use client'
import React,{useEffect,useState, useMemo} from 'react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

import Image from 'next/image'
import DeleteIcon from '@/public/delete-user.svg';
import { Delete } from 'lucide-react';


interface Employee{
    created_at:string,
    first_name:string,
    last_name:string,
    role:string,
    id:string,
}

const EmployeesTable = () => {

const [employees,setEmployees] = useState<Employee[]>([])

const getEmployees = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/employees`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const employees = await response.json();
    console.log("employees", employees);
    setEmployees(employees)
    return employees;
  } catch (e) {
    console.error("Failed to fetch employees:", e);
    return null;
  }
};

useEffect(()=>{
getEmployees();
},[])

const columns = useMemo<ColumnDef<Employee>[]>(
  () => [
    {
      header: "First Name",
      accessorKey: "first_name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
    },
    {
      header: "",
      id:"actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <>
            {/* <Image src="/delete-user.svg" alt="fire" width={30} height={30} className="hover:text-red-500"/> */}
            <DeleteIcon
              className="hover:text-red-500 w-6 h-6 hover:cursor-pointer"
              style={{ fill: "currentColor" }}
            />
            {/* Or use <Image src="/fire.png" alt="Fire" width={20} height={20} /> */}
          </>
        );
      },
    },
  ],
  []
);

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


   return (
     <div className="overflow-x-auto p-4">
       <table className="min-w-full border border-gray-300">
         <thead className="bg-gray-100">
           {table.getHeaderGroups().map((headerGroup) => (
             <tr key={headerGroup.id}>
               {headerGroup.headers.map((header) => (
                 <th key={header.id} className="p-2 text-left border-b">
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
             <tr key={row.id} className="hover:bg-gray-50">
               {row.getVisibleCells().map((cell) => (
                 <td key={cell.id} className="p-2 border-b">
                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
                 </td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
}

export default EmployeesTable