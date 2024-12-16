import { Box, Tooltip, Typography } from "@mui/material"
import React from "react"

import { CopyToClipboard } from "./CopyToClipboard"
import { MonoFontFF } from "./RootLayout/fonts"
import { TokenInfo } from "@/services/token-api"
import { formatNumber } from "@/utils/number-utils"

type TokenAmountBlockProps = {
  amount: string | number
  tokenInfo?: TokenInfo
  needsParsing?: boolean
}

export function TokenAmountBlock(props: TokenAmountBlockProps) {
  const { amount, tokenInfo, needsParsing } = props

  let amountNumber = Number(amount)
  const decimals = amountNumber !== 0 && tokenInfo ? tokenInfo.denomination : 0

  if (needsParsing) amountNumber = amountNumber / 10 ** decimals

  const smallAmount = amountNumber < 1 && amountNumber > -1

  const shortValue = formatNumber(amountNumber, {
    minimumFractionDigits: smallAmount ? decimals : 3,
    maximumFractionDigits: smallAmount ? decimals : 3,
  })
  const longValue = formatNumber(amountNumber, {
    minimumFractionDigits: decimals,
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
            <Typography fontFamily={MonoFontFF} component="span" variant="inherit">
              <span>{longValue}</span>
            </Typography>
          }
        >
          <span>{shortValue}</span>
        </Tooltip>
        <CopyToClipboard value={String(amount)} />
      </Box>
    </Typography>
  )
}
