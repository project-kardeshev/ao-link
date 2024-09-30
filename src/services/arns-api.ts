import { dryrun } from "@permaweb/aoconnect/browser"

import { isArweaveId } from "@/utils/utils"

export async function getOwnedDomains(entityId: string): Promise<string[]> {
  const result = await dryrun({
    process: import.meta.env.VITE_ARNS_ANT_REGISTRY,
    tags: [
      { name: "Action", value: "Access-Control-List" },
      { name: "Address", value: entityId },
    ],
  })

  try {
    if (result.Messages.length === 0) {
      throw new Error(`No response from (get) Access-Control-List (${entityId})`)
    }

    const acl = JSON.parse(result.Messages[0].Data) as {
      Controlled: string[]
      Owned: string[]
    }

    return acl.Owned
  } catch (err) {
    console.error(err)
    return []
  }
}

type ArnsRecord = {
  processId: string
  startTimestamp: number
  type: string
  endTimestamp: number
  purchasePrice: number
  undernameLimit: number
}

export async function getRecord(name: string) {
  const result = await dryrun({
    process: import.meta.env.VITE_ARNS_AR_IO_REGISTRY,
    tags: [
      { name: "Action", value: "Record" },
      { name: "Name", value: name },
    ],
  })

  try {
    if (result.Messages.length === 0) {
      throw new Error(`No response from (get) Record (${name})`)
    }

    const record = JSON.parse(result.Messages[0].Data) as ArnsRecord

    return record
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getRecordValue(antId: string) {
  const result = await dryrun({
    process: antId,
    tags: [
      { name: "Action", value: "Record" },
      { name: "Sub-Domain", value: "@" },
    ],
  })

  try {
    if (result.Messages.length === 0) {
      throw new Error(`No response from (get) Record (value) (${antId})`)
    }

    const recordValue = JSON.parse(result.Messages[0].Data) as {
      transactionId: string
      ttlSeconds: number
    }

    return recordValue
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function resolveArns(text: string) {
  if (isArweaveId(text)) {
    throw new Error("Most likely not an arns.")
  }
  const record = await getRecord(text)
  if (!record) return null

  const recordValue = await getRecordValue(record.processId)
  return recordValue?.transactionId || null
}
