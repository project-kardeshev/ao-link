import { Link, Skeleton, Tooltip } from "@mui/material"
import React, { useCallback, useEffect } from "react"

import { getBalance } from "@/services/token-api"
import { nativeTokenInfo } from "@/utils/native-token"

import { timeout } from "@/utils/utils"

import { SectionInfo } from "./SectionInfo"
import { TokenAmountBlock } from "./TokenAmountBlock"

type BalanceSectionProps = {
  entityId: string
}

export function BalanceSection(props: BalanceSectionProps) {
  const { entityId } = props

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("asd")
  const [balance, setBalance] = React.useState<number | null>(null)

  const fetchBalance = useCallback(async () => {
    setLoading(true)
    setError("")
    Promise.race([
      getBalance(nativeTokenInfo.processId, entityId),
      timeout(2_000),
    ])
      .then((balance) => {
        setBalance(balance as number)
      })
      .catch((error) => {
        setError(String(error))
      })
      .finally(() => setLoading(false))
  }, [entityId, setError])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <SectionInfo
      title="Balance"
      value={
        <>
          {loading ? (
            <Skeleton width={120} />
          ) : balance === null ? (
            <Tooltip title={error}>
              <Link component="button" onClick={fetchBalance}>
                Retry
              </Link>
            </Tooltip>
          ) : (
            <TokenAmountBlock
              amount={balance}
              tokenInfo={nativeTokenInfo}
              needsParsing
              showTicker
            />
          )}
        </>
      }
    />
  )
}
