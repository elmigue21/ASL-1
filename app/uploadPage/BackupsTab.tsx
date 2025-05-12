import React from 'react'
import BackupsTable from '../components/BackupsTable';
// import {supabase} from '../../lib/supabase';
// import {useState} from 'react'


// interface BackupData {
//   fileName: string;
//   fileURL: string;
//   id: number;
//   created_at: Date;
//   fileSize: number;
// }
const BackupsTab = () => {



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