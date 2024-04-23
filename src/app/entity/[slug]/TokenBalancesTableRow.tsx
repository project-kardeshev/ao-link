import { TableCell, TableRow } from "@mui/material"

import { useEffect, useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { RetryableBalance } from "@/components/RetryableBalance"
import { TokenBlock } from "@/components/TokenBlock"
import { TokenInfo, getTokenInfo } from "@/services/token-api"
import { truncateId } from "@/utils/data-utils"
import { nativeTokenInfo } from "@/utils/native-token"

type TokenBalancesTableRowProps = {
  tokenId: string
  entityId: string
}

export function TokenBalancesTableRow(props: TokenBalancesTableRowProps) {
  const { tokenId, entityId } = props

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined)
  useEffect(() => {
    if (tokenId === nativeTokenInfo.processId) {
      setTokenInfo(nativeTokenInfo)
    } else {
      getTokenInfo(tokenId).then(setTokenInfo)
    }
  }, [tokenId])

  return (
    <TableRow>
      <TableCell>
        <IdBlock
          label={tokenInfo?.name || truncateId(tokenId)}
          value={tokenId}
          href={`/token/${tokenId}`}
        />
      </TableCell>
      <TableCell align="right">
        {tokenInfo ? (
          <RetryableBalance entityId={entityId} tokenInfo={tokenInfo} />
        ) : null}
      </TableCell>
      <TableCell align="right">
        <TokenBlock tokenId={tokenId} tokenInfo={tokenInfo} />
      </TableCell>
    </TableRow>
  )
}
