import { Avatar, Stack } from "@mui/material"
import React from "react"

import { truncateId } from "@/utils/data-utils"
import { nativeTokenInfo } from "@/utils/native-token"

import { IdBlock } from "./IdBlock"
import { RetryableBalance } from "./RetryableBalance"
import { SectionInfo } from "./SectionInfo"

type BalanceSectionProps = {
  entityId: string
}

export function BalanceSection(props: BalanceSectionProps) {
  const { entityId } = props

  const tokenInfo = nativeTokenInfo
  const tokenId = tokenInfo.processId

  return (
    <SectionInfo
      title="Balance"
      value={
        <Stack direction="row" gap={1} alignItems="center">
          <RetryableBalance entityId={entityId} tokenInfo={nativeTokenInfo} />
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
      }
    />
  )
}
