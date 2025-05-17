import React/* , { Suspense } */ from 'react'
import { SubscriptionsTable } from '../components/SubscriptionsTable'
import SubscriptionsTableMobile from '../components/SubscriptionsTableMobile'
import Navbar from '../components/Navbar'
import NavbarMobile from '../components/NavbarMobile'
import SubTable from '../components/SubsTable'

function TablesPage() {

  return (
    <div>
        {/* <Navbar />
        <NavbarMobile/> */}

      <div className="z-45 absolute top-[11vh] left-[8.35vw] p-5">
        {/* <Button onClick={()=>{openClicked()}}>OPEN WINDOW</Button> */}
        {/* <Suspense fallback={<div>LOADING</div>}> */}
          {/* <div className="sm:hidden md:block">
            <SubscriptionsTable />
          </div>
          <div className="xsm:block md:hidden w-[calc(100vw-100px)] h-[calc(100vh-64px)]">
            <SubscriptionsTableMobile />
          </div> */}
          <SubTable/>
        {/* </Suspense> */}
        {/* <Button onClick={()=>{fetchEmail()}}>qweqwe</Button> */}
      </div>
      {/* <EmailWindow /> */}
    </div>
  );
}

export default TablesPage
