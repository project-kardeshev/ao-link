import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { getOwnedDomains } from "@/services/arns-api"
import { getNameRecordFromAnt, getSetRecordsToEntityId } from "@/services/messages-api"

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

  const lastValidSetRecord = useMemo(() => {
    if (!setRecords || !ownedDomains) return null

    return setRecords.find((record) => ownedDomains.includes(record.to))
  }, [setRecords, ownedDomains])

  const lastValidAntId = useMemo(() => {
    return lastValidSetRecord?.to
  }, [lastValidSetRecord])

  const { data: lastValidRecord, isLoading: recordLoading } = useQuery({
    queryKey: ["record-of", lastValidAntId],
    enabled: !!lastValidAntId,
    queryFn: async () => {
      if (!lastValidAntId) throw new Error("Invalid params")

      const [, results] = await getNameRecordFromAnt(1, undefined, false, lastValidAntId)
      return {
        name: results[0].tags["Name"],
        purchaseType: results[0].tags["Purchase-Type"],
        years: results[0].tags["Years"],
      }
    },
  })

  if (setRecordsLoading || ownedDomainsLoading || recordLoading) return null

  return lastValidRecord ? `${lastValidRecord.name}.ar` : undefined
}
