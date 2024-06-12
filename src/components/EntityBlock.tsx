import { Fade, Stack, Tooltip } from "@mui/material"
import { DiamondsFour } from "@phosphor-icons/react"
import React, { useEffect } from "react"

import { IdBlock } from "./IdBlock"
import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"

type EntityBlockProps = { entityId: string; fullId?: boolean }

export function EntityBlock(props: EntityBlockProps) {
  const { entityId, fullId } = props

  const [msg, setMsg] = React.useState<AoMessage>()

  useEffect(() => {
    if (!entityId) return

    getMessageById(entityId).then(setMsg)
  }, [entityId])

  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {msg?.type === "Process" && (
        <Fade in>
          <Tooltip title="Process">
            <DiamondsFour height={16} width={16} />
          </Tooltip>
        </Fade>
      )}
      <IdBlock
        label={fullId ? entityId : truncateId(entityId)}
        value={entityId}
        href={`/entity/${entityId}`}
      />
    </Stack>
  )
}
