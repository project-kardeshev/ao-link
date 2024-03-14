import { dryrun } from "@permaweb/aoconnect/browser"

import { nativeTokenInfo } from "@/utils/native-token"
import { wait } from "@/utils/utils"

export type TokenInfo = {
  processId: string
  denomination: number
  ticker: string
  logo: string
  name: string
}

export type TokenHolder = {
  rank: number
  entityId: string
  balance: number
}

export async function getBalance(tokenInfo: TokenInfo, entityId: string) {
  const result = await dryrun({
    process: tokenInfo.processId,
    data: "",
    tags: [
      { name: "Action", value: "Balance" },
      { name: "Target", value: entityId },
    ],
  })

  try {
    const balance = parseFloat(result.Messages[0].Data)
    return balance / 10 ** tokenInfo.denomination
  } catch (err) {
    console.error(err)
  }

  return null
}

type BalanceMap = {
  [key: string]: string | number
}

export async function getTokenHolders(
  tokenInfo: TokenInfo,
): Promise<TokenHolder[]> {
  const result = await dryrun({
    process: tokenInfo.processId,
    data: "",
    tags: [{ name: "Action", value: "Balances" }],
  })

  try {
    const balanceMap = JSON.parse(result.Messages[0].Data) as BalanceMap
    const tokenHolders = Object.keys(balanceMap)
      .filter(
        (entityId) =>
          balanceMap[entityId] !== "0" && balanceMap[entityId] !== 0,
      )
      .sort((a, b) => Number(balanceMap[b]) - Number(balanceMap[a]))
      .map((entityId, index) => ({
        rank: index + 1,
        entityId,
        balance: Number(balanceMap[entityId]) / 10 ** tokenInfo.denomination,
      }))

    return tokenHolders
  } catch (err) {
    console.error(err)
  }

  return []
}

type Tag = {
  name: string
  value: string
}

export async function getTokenInfo(
  processId: string,
): Promise<TokenInfo | undefined> {
  const result = await dryrun({
    process: processId,
    data: "",
    tags: [{ name: "Action", value: "Info" }],
  })

  try {
    const tags = result.Messages[0].Tags as Tag[]
    const tagMap = tags.reduce(
      (acc, tag) => {
        acc[tag.name] = tag.value
        return acc
      },
      {} as { [key: string]: string },
    )

    return {
      processId,
      denomination: parseInt(tagMap["Denomination"]),
      ticker: tagMap["Ticker"],
      logo: tagMap["Logo"],
      name: tagMap["Name"],
    }
  } catch (err) {
    console.error(err)
  }
}

export type TokenInfoMap = Record<string, TokenInfo>

export async function getTokenInfoMap(
  processIds: string[],
): Promise<TokenInfoMap> {
  const tokenInfoMap: TokenInfoMap = {}

  const results = await Promise.all(
    processIds.map((processId) =>
      processId === nativeTokenInfo.processId
        ? nativeTokenInfo
        : Promise.race([getTokenInfo(processId), wait(2_000)]),
    ),
  )

  for (const info of results) {
    if (info) {
      tokenInfoMap[info.processId] = info
    }
  }

  return tokenInfoMap
}
