import React/* , { Suspense } */ from 'react'
// import { SubscriptionsTable } from '../components/SubscriptionsTable'
// import SubscriptionsTableMobile from '../components/SubscriptionsTableMobile'
import Navbar from '../components/Navbar'
import SubTable from '../components/SubsTable'
import EmailWindow from '../components/EmailWindow'

function TablesPage() {

  return (
    <div className="z-45 absolute top-[6vh] p-5 flex w-screen md:top-[11vh] md:w-[calc(100%-9vw)] h-full md:left-[8.35vw] overflow-scroll md:overflow-visible md:h-[calc(100%-11vh)]">
      <EmailWindow />

      <SubTable />
    </div>
  );
}

export default TablesPage
