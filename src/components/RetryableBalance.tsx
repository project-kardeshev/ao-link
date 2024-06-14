import { Box, Link, Skeleton, Tooltip } from "@mui/material"
import React, { useCallback, useEffect } from "react"

import { TokenAmountBlock } from "./TokenAmountBlock"
import { TokenInfo, getBalance } from "@/services/token-api"

import { timeout } from "@/utils/utils"

type RetryableBalanceProps = {
  entityId: string
  tokenInfo: TokenInfo
}

export function RetryableBalance(props: RetryableBalanceProps) {
  const { entityId, tokenInfo } = props

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [balance, setBalance] = React.useState<number | null>(null)

  const fetchBalance = useCallback(async () => {
    setLoading(true)
    setError("")
    Promise.race([getBalance(tokenInfo.processId, entityId), timeout(60_000)])
      .then((balance) => {
        setBalance(balance as number)
      })
      .catch((error) => {
        setError(String(error))
      })
      .finally(() => setLoading(false))
  }, [entityId, tokenInfo.processId])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <Box sx={{ minHeight: 22 }}>
      {loading ? (
        <Skeleton width={100} sx={{ display: "inline-flex" }} height={22} />
      ) : balance === null ? (
        <Tooltip title={error}>
          <Link component="button" onClick={fetchBalance} underline="hover">
            Retry
          </Link>
        </Tooltip>
      ) : (
        <TokenAmountBlock amount={balance} tokenInfo={tokenInfo} needsParsing />
      )}
    </Box>
  )
}
