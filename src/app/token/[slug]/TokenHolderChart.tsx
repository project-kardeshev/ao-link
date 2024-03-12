import React from "react"

import { PieChart } from "@/components/Charts/PieChart"
import { TokenHolder, TokenInfo } from "@/services/token-api"
import { nativeTokenInfo } from "@/utils/native-token"

type TokenHolderChartProps = {
  data: TokenHolder[]
  tokenInfo: TokenInfo
}

export function TokenHolderChart(props: TokenHolderChartProps) {
  const { data, tokenInfo } = props

  const startIndex = tokenInfo.processId === nativeTokenInfo.processId ? 2 : 0

  return (
    <>
      <PieChart
        seriesTitle="Quantity"
        data={data.slice(startIndex, 100).map((holder) => ({
          name: holder.entityId,
          y: holder.balance,
        }))}
      />
    </>
  )
}
