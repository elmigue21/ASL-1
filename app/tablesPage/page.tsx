import React/* , { Suspense } */ from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'
import SubscriptionsTableMobile from '../components/SubscriptionsTableMobile'
import Navbar from '../components/Navbar'
import NavbarMobile from '../components/NavbarMobile'
import SubTable from '../components/SubsTable'

function TablesPage() {

  return (
    <div className="">
        {/* <Navbar />
        <NavbarMobile/> */}

      <div className="z-45 absolute top-[11vh] left-[8.35vw] p-5 flex items-center justify-center w-[calc(100%-100px)]">

          <SubTable/>

      </div>

    </div>
  );
}

export default TablesPage
