import { CopyToClipboard } from "@/components/CopyToClipboard"
import Header from "@/components/Header"
import EventsTable from "@/page-components/HomePage/EventsTable"
import { getAoEventsForBlock } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"
import { formatNumber } from "@/utils/number-utils"

type BlockPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function BlockPage(props: BlockPageProps) {
  const { slug: blockHeight } = props.params

  const events = (await getAoEventsForBlock(blockHeight)) || []
  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main className="min-h-screen mb-6">
      <Header />
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">Block</p>
        <p className="font-bold">/</p>
        <p className="fill-[#7d7d7d]">
          {formatNumber(parseInt(blockHeight))}{" "}
          <CopyToClipboard value={blockHeight} />
        </p>
      </div>

      <div className="text-main-dark-color uppercase mt-[2.75rem] mb-8">
        {events.length} events
      </div>
      <EventsTable
        initialData={initialTableData}
        blockHeight={parseInt(blockHeight)}
      />
    </main>
  )
}
