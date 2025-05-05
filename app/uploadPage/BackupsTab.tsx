import React from 'react'
import BackupsTable from '../components/BackupsTable';
import {supabase} from '../../lib/supabase';
import {useState} from 'react'


interface BackupData {
  fileName: string;
  fileURL: string;
  id: number;
  created_at: Date;
}
const BackupsTab = () => {

       const backupBucket = async () => {
         const { data: sessionData } = await supabase.auth.getSession();
         const token = sessionData.session?.access_token;
    
         if (!token) {
           return;
         }
    
         const response = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/backups/backupBucket`,
           {
             method: "GET",
             headers: {
               Authorization: `Bearer ${token}`, // ✅ Attach token in request
               "Content-Type": "application/json",
             },
           }
         );
         const data = await response.json();
         console.log(data);
         alert("BACKUPS bucket");
       };

       const [backups,setBackups] = useState<BackupData[]>([])
    
        const grabBucket = async () => {
         const { data: sessionData } = await supabase.auth.getSession();
         const token = sessionData.session?.access_token;
         console.log('grab bucket')
    
         if (!token) {
           return;
         }
          console.log("grab bucket2");
    
         const response = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/backups/grabBucket`,
           {
             method: "GET",
             headers: {
               Authorization: `Bearer ${token}`, // ✅ Attach token in request
               "Content-Type": "application/json",
             },
           }
         );
         const data = await response.json();
         console.log(data);
         alert("BACKUPS bucket");
       };

       const getBackups = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
       
            if (!token) {
              return;
            }
       
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/backups/getBackups`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`, // ✅ Attach token in request
                  "Content-Type": "application/json",
                },
              }
            );
            const data = await response.json();
            console.log(data);
           //  alert('BACKUPS GOT')
            setBackups(data);
          };
       

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center">
        <div className="bg-red-500 h-2 w-2 mx-2 rounded-full"></div>
        <h1 className="font-bold">Backups</h1>
      </div>
       <div className="bg-red-500 h-2"></div>

       <div>
        <BackupsTable/>
       </div>
    </div>
  );
}

export default BackupsTab