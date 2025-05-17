import React from "react";
// import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import ReportsTable from "../components/ReportsTable";

const ReportsTab = () => {

    const [isOpen,setIsOpen] = useState(false);

/*   const exportExcel = async () => {

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/exportExcel`,
        {
          method: "GET",
          headers: {
          },
          credentials:"include"
        }
      );

            if (!response.ok) {
              const errorText = await response.text(); // handle error response as text
              throw new Error(errorText || "Export excel failed");
            }

      console.log("blob");
      const blob = await response.blob();
      
      
    const contentDisposition = response.headers.get('Content-Disposition');

            console.log('CONTENT DISPOSITION', contentDisposition)

    const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : 'default-file.xlsx';



      console.log(blob);
      console.log("FILE NAME",fileName)

      // const date = new Date().toLocaleDateString("en-CA");
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        // `excel-export-${new Date().toISOString()}.xlsx`
        fileName
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export error:", error);
    }
  };



   const generatePdf = async () => {
     try {
       const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/upload/generatePdf`,
         {
           method: "GET",
           headers: {
           },
           credentials:"include"
         }
       );

       if (!response.ok) {
         const errorText = await response.text(); // handle error response as text
         throw new Error(errorText || "Export excel failed");
       }

       console.log("blob");
       const blob = await response.blob();


    const contentDisposition = response.headers.get("Content-Disposition");

    console.log("CONTENT DISPOSITION", contentDisposition);

    const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : "default-file.xlsx";


       console.log(blob);

      //  const date = new Date().toLocaleDateString("en-CA");
       const url = window.URL.createObjectURL(blob);
       const link = document.createElement("a");
       link.href = url;
       link.setAttribute(
         "download",
         fileName
       ); //or any other extension
       document.body.appendChild(link);
       link.click();
       link.remove();
     } catch (error) {
       console.error("Export error:", error);
     }
   }; */

  //  const downloadFile = async({fileName,fileStorage}:{fileName:string,fileStorage:string}) =>{
  //        const { data: sessionData } = await supabase.auth.getSession();
  //        const token = sessionData.session?.access_token;

  //        if (!token) {
  //          alert("You are not authenticated.");
  //          return;
  //        }
  //        console.log("export excel");
  //        try {
  //          const response = await fetch(
  //            `${process.env.NEXT_PUBLIC_API_URL}/upload/downloadFile?fileName=${fileName}&fileStorage=${fileStorage}`,
  //            {
  //              method: "GET",
  //              headers: {
  //                Authorization: `Bearer ${token}`,
  //              },
  //            }
  //          );

  //          if (!response.ok) {
  //            const errorText = await response.text(); // handle error response as text
  //            throw new Error(errorText || "Export excel failed");
  //          }

  //          console.log("blob");
  //          const blob = await response.blob();

  //          //  const contentDisposition = response.headers.get(
  //          //    "Content-Disposition"
  //          //  );
  //          //  const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
  //          //  const fileName = fileNameMatch
  //          //    ? fileNameMatch[1]
  //          //    : "default-file.xlsx";
  //         //  const contentDisposition = response.headers.get(
  //         //    "Content-Disposition"
  //         //  );

  //         //  console.log("CONTENT DISPOSITION", contentDisposition);

  //         //  const fileNameMatch =
  //         //    contentDisposition?.match(/filename="([^"]+)"/);
  //         //  const fileName = fileNameMatch
  //         //    ? fileNameMatch[1]
  //         //    : "report-file.xlsx";

  //          console.log(blob);

  //          const date = new Date().toLocaleDateString("en-CA");
  //          const url = window.URL.createObjectURL(blob);
  //          const link = document.createElement("a");
  //          link.href = url;
  //         //  link.setAttribute(
  //         //    "download",
  //         //    `data-report-${new Date().toISOString()}.pdf`
  //         //  ); //or any other extension
  //          document.body.appendChild(link);
  //          link.click();
  //          link.remove();
  //        } catch (error) {
  //          console.error("Export error:", error);
  //        }
  //  }


  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center">
        <div className="bg-blue-500 h-2 w-2 mx-2 rounded-full"></div>
        <h1 className="font-bold text-4xl">Reports</h1>
      </div>
      <div className="bg-blue-500 h-2"></div>
{/* <h1 className="text-4xl font-bold text-blue-900">Reports Log</h1> */}
      {/* <div className="flex gap-4 items-center my-5">
        <h1 className="font-bold text-3xl">Reports Log</h1>
        <Button
          className="bg-white border-2 border-slate-500 text-black hover:bg-slate-200 hover:border-slate-400 hover:cursor-pointer"
          onClick={() => {
            exportExcel();
          }}
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
        >
          <Image
            src="/file-medical-alt.png"
            alt="backup-icon"
            width={20}
            height={20}
          />
          Generate Report
        </Button>
      </div> */}

      <div>
        <ReportsTable />
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } bg-red-500 h-[100%] w-[100%]`}
      >
        <div
          onClick={() => {
            setIsOpen(false);
          }}
        >
          X
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
