import React from "react"

import { PieChart } from "@/components/Charts/PieChart"
import { TokenHolder, TokenInfo } from "@/services/token-api"

type TokenHolderChartProps = {
  data: TokenHolder[]
  tokenInfo: TokenInfo
}

export function TokenHolderChart(props: TokenHolderChartProps) {
  const { data } = props

  return (
    <>
      <PieChart
        seriesTitle="Quantity"
        data={data.slice(0, 100).map((holder) => ({
          name: holder.entityId,
          y: holder.balance,
        }))}
      />
    </>
  )
}
