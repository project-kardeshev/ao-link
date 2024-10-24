import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { useArnsRecordsMap } from "./useArnsRecords"
import { getOwnedDomains, getRecordValue } from "@/services/arns-api"
import { getSetRecordsToEntityId } from "@/services/messages-api"

export function useArnsForEntityId(entityId = "") {
  const { data: setRecords, isLoading: setRecordsLoading } = useQuery({
    queryKey: ["set-records-of", entityId],
    queryFn: async () => {
      const [, results] = await getSetRecordsToEntityId(100, undefined, false, entityId)
      return results
    },
  })

  const { data: ownedDomains, isLoading: ownedDomainsLoading } = useQuery({
    queryKey: ["owned-domains-of", entityId],
    queryFn: async () => {
      const results = await getOwnedDomains(entityId)
      return results
    },
  })

  const antIdCandidates = useMemo(() => {
    if (!setRecords || !ownedDomains) return null

    const list = setRecords
      .filter((record) => ownedDomains.includes(record.to))
      .map((record) => record.to)

    return [...new Set(list)]
  }, [setRecords, ownedDomains])

  const { data: antRecordValues, isLoading: antRecordValuesLoading } = useQuery({
    queryKey: ["record-states-of", antIdCandidates],
    enabled: !!antIdCandidates,
    queryFn: async () => {
      if (!antIdCandidates) throw new Error("Invalid params")

      const results = await Promise.all(antIdCandidates.map(getRecordValue))
      return results.filter((record) => record !== null)
    },
  })

  const lastValidAntId = useMemo(() => {
    return antRecordValues?.find((x) => entityId === x?.transactionId)?.antId
  }, [antRecordValues])

  const recordsMap = useArnsRecordsMap()

  const lastValidName = useMemo(() => {
    if (!lastValidAntId || !recordsMap) return

    return Object.keys(recordsMap).find(
      (recordName) => recordsMap[recordName].processId === lastValidAntId,
    )
  }, [recordsMap, lastValidAntId])

  if (setRecordsLoading || ownedDomainsLoading || !recordsMap || antRecordValuesLoading) return null

  return lastValidName ? `${lastValidName}.ar` : undefined
}
