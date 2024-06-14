import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { getMessageById } from "@/services/messages-api"

import { AoMessage } from "@/types"
import { isArweaveId } from "@/utils/utils"

export default function EntityPage() {
  const { entityId } = useParams()

  const [message, setMessage] = useState<AoMessage | undefined | null>(null)

  const validAddress = useMemo(() => isArweaveId(String(entityId)), [entityId])

  useEffect(() => {
    if (!entityId) return

    getMessageById(entityId).then(setMessage)
  }, [entityId])

  if (!entityId || !validAddress) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>Invalid Process ID.</Typography>
      </Stack>
    )
  }

  if (message === null) {
    return <LoadingSkeletons />
  }

  if (!message) {
    return <UserPage key={entityId} entityId={entityId} />
  }

  if (message.type === "Process") {
    return <ProcessPage key={entityId} message={message} />
  }

  // return redirect(`/message/${entityId}`) // FIXME
  return null
}
