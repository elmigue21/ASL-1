import React from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'
import Navbar from '../components/Navbar'
function TablesPage() {
  return (
    <div>
      <Navbar />      
      <div className="z-45 fixed top-25 left-40 p-5">
        <SubscriptionsTable />
      </div>
    </div>
  );
}

export default TablesPage
