import { Box, Tooltip, Typography } from "@mui/material"
import React from "react"

import { TokenInfo } from "@/services/token-api"
import { formatNumber } from "@/utils/number-utils"

import { CopyToClipboard } from "./CopyToClipboard"
import { MonoFontFF } from "./RootLayout/fonts"

type TokenAmountBlockProps = { amount: string | number; tokenInfo: TokenInfo }

export function TokenAmountBlock(props: TokenAmountBlockProps) {
  const { amount, tokenInfo } = props

  const amountNumber = Number(amount)
  const shortValue = formatNumber(amountNumber, {
    maximumFractionDigits: 0,
  })
  const longValue = formatNumber(amountNumber, {
    minimumFractionDigits: tokenInfo.denomination,
  })

  return (
    <Typography fontFamily={MonoFontFF} component="div" variant="inherit">
      <Box
        sx={{
          fill: "none",
          "&:hover": { fill: "var(--mui-palette-text-secondary)" },
        }}
      >
        <Tooltip
          title={
            <Typography
              fontFamily={MonoFontFF}
              component="span"
              variant="inherit"
            >
              {longValue}
              {/* {tokenInfo.ticker} */}
            </Typography>
          }
        >
          <span>{shortValue}</span>
        </Tooltip>
        <CopyToClipboard value={String(amount)} />
      </Box>
      {/* <IdBlock
        label={}
        value={String(item.blockHeight)}
        href={`/block/${item.blockHeight}`}
      /> */}
    </Typography>
    // <IdBlock>
    //   {formatNumber(amountNumber, {
    //     maximumFractionDigits: 0,
    //   })}
    // </IdBlock>
  )
}
