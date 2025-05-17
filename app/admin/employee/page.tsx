'use client'
import React,{useEffect} from 'react'
import EmployeesTable from '@/app/components/EmployeesTable';


const EmployeeManagementPage = () => {


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
    return employees;
  } catch (e) {
    console.error("Failed to fetch employees:", e);
    return null;
  }
};

useEffect(()=>{
getEmployees();
},[])


  return (
    <div className="z-45 absolute top-[11vh] left-[8.35vw] w-[90vw] h-[60vh]">
      <h1 className="text-4xl font-bold text-blue-900 p-5">Employee Management Dashboard</h1>
      <EmployeesTable />
    </div>
  );
}

export default EmployeeManagementPage