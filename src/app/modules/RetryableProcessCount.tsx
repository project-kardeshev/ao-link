import { Box, Link, Skeleton, Tooltip } from "@mui/material"
import React, { useCallback, useEffect } from "react"

import { getSpawnedProcessesFromModule } from "@/services/messages-api"
import { timeout } from "@/utils/utils"

type RetryableProcessCountProps = {
  moduleId: string
}

export function RetryableProcessCount(props: RetryableProcessCountProps) {
  const { moduleId } = props

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("asd")
  const [count, setCount] = React.useState<number | null>(null)

  const fetchValue = useCallback(async () => {
    setLoading(true)
    setError("")
    Promise.race([getSpawnedProcessesFromModule(1, undefined, true, moduleId), timeout(5_000)])
      .then((value: any) => {
        setCount(value[0])
      })
      .catch((error) => {
        setError(String(error))
      })
      .finally(() => setLoading(false))
  }, [moduleId])

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
