import { Avatar, Stack } from "@mui/material"
import React from "react"

import { TokenInfo } from "@/services/token-api"
import { truncateId } from "@/utils/data-utils"

import { IdBlock } from "./IdBlock"

type TokenBlockProps = {
  tokenId: string
  tokenInfo?: TokenInfo
}

export function TokenBlock(props: TokenBlockProps) {
  const { tokenId, tokenInfo } = props

  return (
    <>
      <Stack direction="row" gap={1} alignItems="center">
        {tokenInfo && (
          <Avatar
            src={`https://arweave.net/${tokenInfo.logo}`}
            alt={tokenInfo.name}
            sx={{ width: 16, height: 16 }}
          />
        )}
        <IdBlock
          label={tokenInfo?.ticker || truncateId(tokenId)}
          value={tokenId}
          href={`/token/${tokenId}`}
        />
      </Stack>
    </>
  )
}
