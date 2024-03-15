import React, { useEffect, useState } from "react"

import { getTokenTransfers } from "@/services/messages-api"
import { TokenInfoMap, getTokenInfoMap } from "@/services/token-api"
import { TokenEvent, normalizeTokenEvent } from "@/utils/ao-event-utils"

import { TokenTransfersTable } from "./TokenTransfersTable"

type TokenTransfersProps = {
  entityId: string
  open: boolean
}

export function TokenTransfers(props: TokenTransfersProps) {
  const { entityId, open } = props
  const [data, setData] = useState<TokenEvent[]>([])
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>({})

  const pageSize = 1000

  useEffect(() => {
    getTokenTransfers(pageSize, undefined, entityId)
      .then((events) => {
        const parsed = events.map(normalizeTokenEvent)
        setData(parsed)

        let uniqueTokenIds = new Set<string>()
        parsed.forEach((event) => {
          uniqueTokenIds.add(event.tokenId)
        })
        const tokenIds = Array.from(uniqueTokenIds)
        return getTokenInfoMap(tokenIds)
      })
      .then(setTokenInfoMap)
  }, [entityId])

  if (!open) return null

  return <TokenTransfersTable data={data} tokenInfoMap={tokenInfoMap} />
}
