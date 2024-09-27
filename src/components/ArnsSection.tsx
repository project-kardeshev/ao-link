import { Skeleton, Typography } from "@mui/material"
import React from "react"

import { SectionInfo } from "./SectionInfo"
import { useArnsForEntityId } from "@/hooks/useArnsForEntityId"

type ArnsSectionProps = {
  entityId: string
}

export function ArnsSection(props: ArnsSectionProps) {
  const { entityId } = props

  const arnsDomain = useArnsForEntityId(entityId)

  return (
    <SectionInfo
      title="ArNS"
      value={
        arnsDomain === null ? (
          <Skeleton width={100} />
        ) : arnsDomain === undefined ? (
          <Typography color="text.secondary" variant="inherit">
            None
          </Typography>
        ) : (
          arnsDomain
        )
      }
    />
  )
}
