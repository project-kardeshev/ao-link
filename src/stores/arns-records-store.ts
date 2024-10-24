import { persistentAtom } from "@nanostores/persistent"

export const $arnsRecordsMap = persistentAtom<string | undefined>("arns-records-map")
export const $arnsRecordsMapFetching = persistentAtom<string | undefined>(
  "arns-records-map-fetching",
)
export const $arnsRecordsMapRefresh = persistentAtom<string>("arns-records-map-refresh", "0")
