import { AreaChart } from "@/components/Charts/AreaChart"
import Header from "@/components/Header"

import EventsTable from "@/page-components/HomePage/EventsTable"
import SearchBar from "@/page-components/HomePage/SearchBar"
import {
  metricsMessages,
  metricsModules,
  metricsProcesses,
  metricsUsers,
} from "@/services/aometrics"
import { getLatestAoEvents } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

export const dynamic = "force-dynamic"

export default async function Home() {
  const messages = await metricsMessages()
  const modules = await metricsModules()
  const users = await metricsUsers()
  const processes = await metricsProcesses()

  const pageLimit = 30

  const events = (await getLatestAoEvents(pageLimit)) || []
  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main>
      <Header />
      <div className="mt-4">
        <SearchBar />
      </div>
      <div className="flex justify-between flex-wrap mt-[64px]">
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          {/* Content for the first container */}
          <AreaChart data={messages} titleText="TOTAL MESSAGES" />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          {/* Content for the second container */}
          <AreaChart data={modules} titleText="MODULES" />
          <div className="separator hidden lg:block"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          {/* Content for the third container */}
          <AreaChart data={users} titleText="USERS" />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          {/* Content for the fourth container */}
          <AreaChart data={processes} titleText="PROCESSES" />
        </div>
      </div>
      <div className="text-main-dark-color uppercase mt-[2.75rem] mb-8">
        Latest
      </div>
      <EventsTable initialData={initialTableData} pageLimit={pageLimit} />
    </main>
  )
}
