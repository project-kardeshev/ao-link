import React from "react"

import { getMessagesByEntityId as getMessagesByEntityId } from "@/services/messages-api"

import { EntityMessagesTable } from "./EntityMessagesTable"

type EntityMessagesProps = {
  entityId: string
  open: boolean
}

export function EntityMessages(props: EntityMessagesProps) {
  const { entityId, open } = props

  const pageSize = 25

  if (!open) return null

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={(offset) =>
        getMessagesByEntityId(pageSize, offset, entityId)
      }
    />
  )
}
