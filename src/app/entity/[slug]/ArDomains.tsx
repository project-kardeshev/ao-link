import React from "react"

import { ArDomainsTable } from "./ArDomainsTable"
import { getOwnedDomainsHistory } from "@/services/messages-api"

type ArDomainsProps = {
  entityId: string
  open: boolean
}

function BaseArDomains(props: ArDomainsProps) {
  const { entityId, open } = props

  if (!open) return null

  const pageSize = 25

  return (
    <ArDomainsTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [, records] = await getOwnedDomainsHistory(
          pageSize,
          lastRecord?.cursor,
          ascending,
          entityId,
        )

        return records
      }}
    />
  )
}

export const ArDomains = React.memo(BaseArDomains)
