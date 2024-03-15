import { supabase } from "@/lib/supabase"
import { getAoEventById, getProcessById } from "@/services/aoscan"

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
    return <UserPage entityId={entityId} />
  }

  const processId = entityId

  const event = await getAoEventById(processId)
  const process = await getProcessById(processId)

  if (!event || !process) {
    return <div>Not Found</div>
  }

  return <ProcessPage event={event} process={process} />
}
