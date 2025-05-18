import React/* , { Suspense } */ from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'
import SubscriptionsTableMobile from '../components/SubscriptionsTableMobile'
import Navbar from '../components/Navbar'
import NavbarMobile from '../components/NavbarMobile'
import SubTable from '../components/SubsTable'
import EmailWindow from '../components/EmailWindow'

function TablesPage() {

  return (
    <div className="z-45 absolute top-[11vh] left-[8.35vw] p-5 flex items-center justify-center w-[calc(100%-100px)] md:w-[90vw] min-h-[80vh] max-h-[80vh]">
      <EmailWindow />

      <SubTable />
    </div>
  );
}

export default TablesPage
