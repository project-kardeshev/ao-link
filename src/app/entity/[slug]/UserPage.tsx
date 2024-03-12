import React from "react"

import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import EventsTable from "@/page-components/HomePage/EventsTable"
import { getLatestAoEvents } from "@/services/aoscan"
import { getBalance } from "@/services/token-api"
import { normalizeAoEvent } from "@/utils/ao-event-utils"
import { nativeTokenInfo } from "@/utils/native-token"
import { formatNumber } from "@/utils/number-utils"

export async function UserPage({ entityId }: { entityId: string }) {
  const ownerId = entityId

  const pageSize = 30

  const events = await getLatestAoEvents(
    pageSize,
    undefined,
    undefined,
    undefined,
    ownerId,
  )
  const initialTableData = events.map(normalizeAoEvent)

  const balance = await getBalance(nativeTokenInfo, ownerId)

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">USER</p>
        <p className="font-bold">/</p>
        <IdBlock label={ownerId} />
      </div>
      <SectionInfo
        title="Balance"
        value={
          <IdBlock
            label={`${formatNumber(balance)} ${nativeTokenInfo.ticker}`}
            value={String(balance)}
            hideTooltip
          />
        }
      />
      <EventsTable
        initialData={initialTableData}
        pageSize={pageSize}
        ownerId={ownerId}
      />
    </main>
  )
}
