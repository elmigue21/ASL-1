// import { Subscript } from 'lucide-react'
import React from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'

const settingsPage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-4/5 h-screen flex items-center justify-center">
        <SubscriptionsTable />
      </div>
    </div>
  );
}

export default settingsPage
