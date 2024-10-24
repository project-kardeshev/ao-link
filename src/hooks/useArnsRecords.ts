import { useStore } from "@nanostores/react"

import { ArnsRecord, getAllRecords } from "@/services/arns-api"
import {
  $arnsRecordsMap,
  $arnsRecordsMapFetching,
  $arnsRecordsMapRefresh,
} from "@/stores/arns-records-store"

export function useArnsRecordsMap() {
  const recordsMapStringified = useStore($arnsRecordsMap)
  const refresh = $arnsRecordsMapRefresh.get()
  const delta = new Date().getTime() - parseInt(refresh)
  const oneDay = 86400000

  const shouldRefresh = refresh === "0" || delta > oneDay

  if (shouldRefresh && $arnsRecordsMapFetching.get() !== "true") {
    console.log("Refetching arns records.")
    $arnsRecordsMapFetching.set("true")
    console.log("Fetching all ARNS records.")
    getAllRecords()
      .then((records) => {
        console.log("Fetched all ARNS records.")
        $arnsRecordsMapRefresh.set(new Date().getTime().toString())
        $arnsRecordsMapFetching.set("false")
        $arnsRecordsMap.set(JSON.stringify(records))
      })
      .catch((err) => {
        console.error(err)
        $arnsRecordsMapFetching.set("false")
      })
  }

  if (!recordsMapStringified) return undefined

  const recordsMap = JSON.parse(recordsMapStringified) as Record<string, ArnsRecord>
  return recordsMap
}

export function useArnsRecords() {
  const recordsMap = useArnsRecordsMap()

  if (!recordsMap) return undefined

  const records: ArnsRecord[] = Object.keys(recordsMap).map((name) => ({
    ...recordsMap[name],
    name,
  }))
  records.sort((a, b) => a.name.localeCompare(b.name))

  return records
}
