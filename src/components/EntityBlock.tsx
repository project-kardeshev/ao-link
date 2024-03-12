import React from "react"

import { IdBlock } from "./IdBlock"

export function EntityBlock(props: { entityId: string }) {
  const { entityId: entityId } = props

  return (
    <IdBlock label={entityId} value={entityId} href={`/entity/${entityId}`} />
  )
}
