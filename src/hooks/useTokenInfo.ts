import { useStore } from "@nanostores/react"
import { useEffect, useMemo } from "react"

import { TokenInfo, getTokenInfo } from "../services/token-api"
import { $tokenInfoCache } from "../stores/token-info-store"
import { nativeTokenInfo } from "../utils/native-token"

export function useTokenInfo(tokenId = "") {
  const cacheMap = useStore($tokenInfoCache, {
    keys: [tokenId],
  })

  const cachedValue = cacheMap ? cacheMap[tokenId] : undefined
  const isFetched = cachedValue !== undefined && cachedValue !== "loading"
  const isValid = cachedValue !== "error"

  const tokenInfo: TokenInfo | undefined | null = useMemo(
    () => (isFetched ? (isValid ? JSON.parse(cachedValue) : null) : undefined),
    [cachedValue, isFetched, isValid],
  )

  useEffect(() => {
    if (
      isFetched ||
      $tokenInfoCache.get()[tokenId] === "loading" ||
      tokenId === nativeTokenInfo.processId
    )
      return

    $tokenInfoCache.setKey(tokenId, "loading")
    getTokenInfo(tokenId)
      .then((tokenInfo) => {
        $tokenInfoCache.setKey(tokenId, JSON.stringify(tokenInfo))
      })
      .catch(() => {
        $tokenInfoCache.setKey(tokenId, "error")
      })
  }, [cachedValue, isFetched, isValid, tokenId])

  if (tokenId === nativeTokenInfo.processId) return nativeTokenInfo

  return tokenInfo
}
