import { getAoEventById, getProcessById } from "@/services/aoscan"

import { getMessageById } from "@/services/messages-api"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"

type EntityPageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function EntityPageServer(props: EntityPageServerProps) {
  const { slug: entityId } = props.params

  const message = await getMessageById(entityId)

  if (!message) {
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
