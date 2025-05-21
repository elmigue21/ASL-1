import React/* , { Suspense } */ from 'react'
// import { SubscriptionsTable } from '../components/SubscriptionsTable'
// import SubscriptionsTableMobile from '../components/SubscriptionsTableMobile'
import Navbar from '../components/Navbar'
// import NavbarMobile from '../components/NavbarMobile'
import SubTable from '../components/SubsTable'
import EmailWindow from '../components/EmailWindow'

function TablesPage() {

  return (
    <div className="z-45 absolute top-[6vh] p-5 flex w-screen justify-center md:top-[11vh] md:w-[calc(100%-9vw)] h-full md:left-[8.35vw] overflow-scroll pb-30 md:overflow-hidden">
      <EmailWindow />

      <SubTable />
    </div>
  );
}

export default TablesPage
