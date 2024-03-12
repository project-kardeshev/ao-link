import React from "react"

import { getTokenHolders, getInfo } from "@/services/token-api"

import TokenPage from "./TokenPage"

type TokenPageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function TokenPageServer(props: TokenPageServerProps) {
  const { slug: processId } = props.params

  const tokenInfo = await getInfo(processId)

  if (!tokenInfo) {
    return <>Not a valid token</>
  }

  const tokenHolders = await getTokenHolders(tokenInfo)

  return <TokenPage tokenInfo={tokenInfo} tokenHolders={tokenHolders} />
}
