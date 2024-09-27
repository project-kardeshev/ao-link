import { dryrun } from "@permaweb/aoconnect/browser"

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
  }

  return []
}
