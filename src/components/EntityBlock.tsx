import React from "react"

import { truncateId } from "@/utils/data-utils"

import { IdBlock } from "./IdBlock"

type EntityBlockProps = { entityId: string; fullId?: boolean }

export function EntityBlock(props: EntityBlockProps) {
  const { entityId, fullId } = props

  return (
    <IdBlock
      label={fullId ? entityId : truncateId(entityId)}
      value={entityId}
      href={`/entity/${entityId}`}
    />
  )
}
