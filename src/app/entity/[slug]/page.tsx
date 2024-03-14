import { supabase } from "@/lib/supabase"
import { getAoEventById, getProcessById } from "@/services/aoscan"

import { getBalance } from "@/services/token-api"

import { nativeTokenInfo } from "@/utils/native-token"
import { wait } from "@/utils/utils"

import { ProcessPage } from "./ProcessPage/ProcessPage"
import { UserPage } from "./UserPage/UserPage"

type EntityPageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function EntityPageServer(props: EntityPageServerProps) {
  const { slug: entityId } = props.params

  const { data, error } = await supabase
    .rpc("determine_entity_type", {
      entity_id: entityId,
    })
    .returns<"user" | "process">()

  if (error || !data) {
    console.error("Error calling Supabase RPC:", error.message)
    return <>Entity not found</>
  }

  if (data === "user") {
    const balance = await Promise.race([
      getBalance(nativeTokenInfo.processId, entityId),
      wait(2_000),
    ])

    return <UserPage entityId={entityId} balance={balance} />
  }

  const processId = entityId

  const event = await getAoEventById(processId)
  const process = await getProcessById(processId)

  if (!event || !process) {
    return <div>Not Found</div>
  }

  return <ProcessPage event={event} process={process} />
}
