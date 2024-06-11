import { Box, Link, Skeleton, Tooltip } from "@mui/material"
import React, { useCallback, useEffect } from "react"

import { getMessagesForBlock } from "@/services/messages-api"
import { timeout } from "@/utils/utils"

type RetryableMsgCountProps = {
  blockHeight: number
}

export function RetryableMsgCount(props: RetryableMsgCountProps) {
  const { blockHeight } = props

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [count, setCount] = React.useState<number | null>(null)

  const fetchValue = useCallback(async () => {
    setLoading(true)
    setError("")
    Promise.race([getMessagesForBlock(1, undefined, true, blockHeight), timeout(5_000)])
      .then((value: any) => {
        setCount(value[0])
      })
      .catch((error) => {
        setError(String(error))
      })
      .finally(() => setLoading(false))
  }, [blockHeight])

  useEffect(() => {
    fetchValue()
  }, [fetchValue])

  return (
    <Box sx={{ minHeight: 22 }}>
      {loading ? (
        <Skeleton width={100} sx={{ display: "inline-flex" }} height={22} />
      ) : count === null ? (
        <Tooltip title={error}>
          <Link component="button" onClick={fetchValue} underline="hover">
            Retry
          </Link>
        </Tooltip>
      ) : (
        <span>{count}</span>
      )}
    </Box>
  )
}
